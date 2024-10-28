import os
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, login_required, logout_user, current_user, UserMixin
import json

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth'
login_manager.login_message = 'Please log in to access this page.'

# Configuration
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "dev_key_123"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

db.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    from models import User
    return User.query.get(int(user_id))

# Load translations
translations = {}
for lang in ['en', 'es', 'fr']:
    with open(f'static/translations/{lang}.json', 'r', encoding='utf-8') as f:
        translations[lang] = json.load(f)

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/auth', methods=['GET', 'POST'])
def auth():
    from models import User
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        email_or_username = request.form['email_or_username']
        # First step of eBay-style authentication
        user = User.query.filter(
            (User.email == email_or_username) | 
            (User.username == email_or_username)
        ).first()
        
        if user:
            session['auth_user_id'] = user.id
            return redirect(url_for('password'))
        else:
            flash('Account not found. Please check your email/username or sign up.')
            
    return render_template('auth.html')

@app.route('/password', methods=['GET', 'POST'])
def password():
    from models import User
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
        
    if 'auth_user_id' not in session:
        return redirect(url_for('auth'))
        
    if request.method == 'POST':
        user = User.query.get(session['auth_user_id'])
        password = request.form['password']
        stay_signed_in = 'staySignedIn' in request.form
        
        if user and check_password_hash(user.password_hash, password):
            login_user(user, remember=stay_signed_in)
            session.pop('auth_user_id', None)
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid password.')
            
    return render_template('password.html')

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    flash('You have been logged out.')
    return redirect(url_for('index'))

@app.route('/signup', methods=['POST'])
def signup():
    from models import User
    
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    
    if not all([username, email, password]):
        flash('All fields are required')
        return redirect(url_for('index'))
    
    # Check if user exists
    if User.query.filter_by(username=username).first():
        flash('Username already exists')
        return redirect(url_for('index'))
    
    if User.query.filter_by(email=email).first():
        flash('Email already registered')
        return redirect(url_for('index'))
    
    # Create new user
    user = User()
    user.username = username
    user.email = email
    user.password_hash = generate_password_hash(password)
    
    db.session.add(user)
    try:
        db.session.commit()
        login_user(user)  # Auto-login after signup
        flash('Registration successful!')
        return redirect(url_for('dashboard'))
    except Exception as e:
        db.session.rollback()
        flash('An error occurred. Please try again.')
        
    return redirect(url_for('index'))

@app.route('/get_translation/<lang>')
def get_translation(lang):
    return jsonify(translations.get(lang, translations['en']))

with app.app_context():
    import models
    db.create_all()
