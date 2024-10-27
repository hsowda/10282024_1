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
        return redirect('https://beautifulafflxtn.w3spaces.com/index.html')
    return redirect(url_for('auth'))

@app.route('/auth')
@app.route('/652d0869-c069-481a-8e8d-557fc9ef3531-00-1vz1q6lqhootf.janeway.replit.dev/auth')
def auth():
    if current_user.is_authenticated:
        return redirect('https://beautifulafflxtn.w3spaces.com/index.html')
    return render_template('auth.html')

@app.route('/dashboard')
def dashboard():
    if not current_user.is_authenticated:
        return redirect(url_for('auth'))
    return redirect('https://beautifulafflxtn.w3spaces.com/index.html')

@app.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return redirect('https://beautifulafflxtn.w3spaces.com/index.html')
        
    username = request.form['username']
    password = request.form['password']
    
    # Accept "12341234" as test credential
    if username == "12341234" or password == "12341234":
        user = User.query.filter_by(username="12341234").first()
        if not user:
            user = User(
                username="12341234",
                password_hash=generate_password_hash("12341234")
            )
            db.session.add(user)
            db.session.commit()
        login_user(user)
        return redirect('https://beautifulafflxtn.w3spaces.com/index.html')
    
    flash('Invalid credentials. Use "12341234" as username or password')
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
