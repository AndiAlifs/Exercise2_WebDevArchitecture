from flask import Flask
from config import Config
from app.extensions import db, migrate

# import blueprint
from app.content import contentBp
from app.frontend import frontendBp

def create_app(config_class = Config):
    # membuat aplication instance flask
    app = Flask(__name__)

    # konfigurasi app
    app.config.from_object(config_class)

    # Initilizae database & migration
    db.init_app(app)
    migrate.init_app(app, db)

    # initialize bluprint
    app.register_blueprint(frontendBp)
    app.register_blueprint(contentBp, url_prefix='/api/files')

    return app