from flask import Flask
import os

from .api import api_routes
from .config import config


def create_app(config_name=None):
    app = Flask(__name__)
    app.register_blueprint(api_routes)

    config_name = config_name or os.environ.get("FLASK_ENV") or "default"
    app.config.from_object(config[config_name])

    return app
