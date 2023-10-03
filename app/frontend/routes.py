from flask import render_template

from app.frontend import frontendBp

@frontendBp.route("/", strict_slashes =False)
def home():
    return render_template("/home/index.html")
