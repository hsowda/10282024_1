import os
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
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
    return redirect(url_for('auth'))

@app.route('/auth')
def auth():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('auth.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/login', methods=['POST'])
def login():
    from models import User
    
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
        
    email = request.form['email']
    password = request.form['password']
    
    # Check for hardcoded credentials
    if email == "123" and password == "asdf":
        # Create or get the default user
        user = User.query.filter_by(email="123").first()
        if not user:
            user = User()
            user.username = "default_user"
            user.email = "123"
            user.password_hash = generate_password_hash("asdf")
            db.session.add(user)
            db.session.commit()
        
        login_user(user)
        return redirect(url_for('dashboard'))
    
    flash('Invalid credentials. Use 123 for login and asdf for password.')
    return redirect(url_for('auth'))

@app.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
    return redirect(url_for('auth'))

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
        return redirect(url_for('auth'))
    
    # Check if user exists
    if User.query.filter_by(username=username).first():
        flash('Username already exists')
        return redirect(url_for('auth'))
    
    if User.query.filter_by(email=email).first():
        flash('Email already registered')
        return redirect(url_for('auth'))
    
    # Create new user
    user = User()
    user.username = username
    user.email = email
    user.password_hash = generate_password_hash(password)
    
    db.session.add(user)
    try:
        db.session.commit()
        login_user(user)
        return redirect(url_for('dashboard'))
    except Exception as e:
        db.session.rollback()
        flash('An error occurred. Please try again.')
        
    return redirect(url_for('auth'))

@app.route('/get_translation/<lang>')
def get_translation(lang):
    return jsonify(translations.get(lang, translations['en']))

with app.app_context():
    import models
    db.create_all()
