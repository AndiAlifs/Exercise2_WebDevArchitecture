from app.extensions import db
from datetime import datetime

class Files(db.Model):
    _id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, file_name, file_path):
        self.file_name = file_name
        self.file_path = file_path
        self.created_at = datetime.utcnow()

    def serialize(self):
        return {
            "_id": self._id,
            "file_name": self.file_name,
            "file_path": self.file_path,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
