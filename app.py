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
@app.route('/652d0869-c069-481a-8e8d-557fc9ef3531-00-1vz1q6lqhootf.janeway.replit.dev/auth')
def auth():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('auth.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
        
    email = request.form['email']
    password = request.form['password']
    
    # Accept "1234" as any credential
    if email == "1234" or password == "1234":
        # Use email "123" for database consistency
        user = User.query.filter_by(email="123").first()
        if not user:
            user = User(
                username="default_user",
                email="123",
                password_hash=generate_password_hash("asdf")
            )
            db.session.add(user)
            db.session.commit()
        login_user(user)
        return redirect(url_for('dashboard'))
    
    # Keep existing "123/asdf" credentials as fallback
    if email == "123" and password == "asdf":
        user = User.query.filter_by(email="123").first()
        if not user:
            user = User(
                username="default_user",
                email="123",
                password_hash=generate_password_hash("asdf")
            )
            db.session.add(user)
            db.session.commit()
        login_user(user)
        return redirect(url_for('dashboard'))
    
    flash('Invalid credentials. Use "1234" in any field, or "123" with password "asdf"')
    return redirect(url_for('auth'))

@app.route('/signup', methods=['POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
        
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    
    if not all([username, email, password]):
        flash('All fields are required')
        return redirect(url_for('auth'))
    
    # Create new user with hardcoded credentials
    if email == "123" and password == "asdf":
        user = User(
            username=username,
            email="123",
            password_hash=generate_password_hash("asdf")
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return redirect(url_for('dashboard'))
    
    flash('Please use email "123" and password "asdf" for testing')
    return redirect(url_for('auth'))

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth'))

@app.route('/get_translation/<lang>')
def get_translation(lang):
    return jsonify(translations.get(lang, translations['en']))

with app.app_context():
    import models
    from models import User
    db.create_all()
