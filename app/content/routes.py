from flask import request, jsonify
from datetime import datetime

from app.extensions import db
from app.content import contentBp
from app.models.file import Files

from minio import Minio
import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"pdf", "docx"}
BUCKET_NAME = "filesbuckets"

client = Minio(
    "localhost:9000",
    access_key="iXQfUsW4GZLEimfzBlX2",
    secret_key="CgoxirQdsbv9VnRgyc5Jlqs0WBgPeyMyUZwbcNHi",
    secure=False,
)

def allowed_file(filename):
    filename = filename.lower()
    extension = filename.split(".")[-1]
    return extension in ALLOWED_EXTENSIONS

@contentBp.route("", methods=["GET"])
def get_all_contents():
    contents = Files.query.all()
    result = [content.serialize() for content in contents]
    response = jsonify(
        success=True,
        data=result,
    )

    return response, 200

@contentBp.route("", methods=["POST"])
def upload_content():
    found = client.bucket_exists(BUCKET_NAME)
    if not found:
        client.make_bucket(BUCKET_NAME)
    else:
        print("Bucket 'filesbuckets' already exists")

    file = request.files["file"]

    if file.filename == '':
        return jsonify({
            'error': 'No file selected'
        }), 422

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_size = os.fstat(file.fileno()).st_size
        client.put_object(
            BUCKET_NAME,
            filename,
            file,
            file_size,
        )
        file_path = client.presigned_get_object(BUCKET_NAME, filename)
        new_file = Files(
            file_name=filename,
            file_path=file_path
        )
        db.session.add(new_file)
        db.session.commit()

        response = jsonify(
            success=True,
            data=new_file.serialize(),
        )

        return response, 200
    else:
        return jsonify({
            'error': 'File not support'
        })

@contentBp.route("<int:id>", methods=["DELETE"])
def delete_content(id):
    content = Files.query.get(id)
    client.remove_object(BUCKET_NAME, content.file_name)
    db.session.delete(content)
    db.session.commit()

    response = jsonify(
        success=True,
        data=content.serialize(),
    )

    return response, 200