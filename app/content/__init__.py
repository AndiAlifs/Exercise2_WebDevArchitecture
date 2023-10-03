from flask import Blueprint
from flask_cors import CORS
contentBp = Blueprint('content', __name__)
CORS(contentBp)
from app.content import routes