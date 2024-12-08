from flask import Flask
from flask_cors import CORS
from app.database import db
from app.routes import api
import os

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:postgres@db:5432/quiz_app'
    )
    
    # Initialize extensions
    db.init_app(app)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    return app 