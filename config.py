import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))
DB_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')


class Config:
    SECRET_KEY = '123'
    # Set the time zone for the entire application
    os.environ['TZ'] = 'Asia/Jakarta'
    SQLALCHEMY_DATABASE_URI = DB_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = True
