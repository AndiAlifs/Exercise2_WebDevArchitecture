from flask import Blueprint

frontendBp = Blueprint('frontend', __name__)

from app.frontend import routes