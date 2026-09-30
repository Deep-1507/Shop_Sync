import base64
from flask import (flash, render_template, request, redirect,
                   session, url_for, send_from_directory, jsonify)
from pathlib import Path
import os
from werkzeug.utils import secure_filename
from controller.image_upload_form import ProfileImageUploadForm, SourceImageUploadForm
from controller.utils import (session_alive, download_image)
from controller.cmate import blend_images
from flask_cors import CORS
from flask_app import create_app
import requests
import uuid

app = create_app()

CORS(app, resources={r"/*": {"origins": "*"}},supports_credentials=True)


PROFILE_DIR = app.config["PROFILE_DIR"]
SOURCE_DIR = app.config["SOURCE_DIR"]
RESULT_DIR = app.config["RESULT_DIR"]

@app.route('/')
def home():
    profile_image = None
    if session_alive(PROFILE_DIR):
        profile_image = session['profile_image']
    return render_template('index.html', profile_image=profile_image)

@app.route('/footer/<path:link>')
def footer(link):
    try:
        return render_template('footer/'+link)
    except Exception:
        return render_template('404.html'), 404

@app.errorhandler(404)
def page_not_found(e):
    # set the 404 status explicitly
    return render_template('404.html'), 404

@app.route('/upload_profile_image/', methods=['GET', 'POST'])
def upload_profile_image():

    profile_form = ProfileImageUploadForm()
    print(f"Session source_image retrieved: {session.get('source_image')}")
    print(f"Session profile_image retrieved: {session.get('profile_image')}")
    if request.method == "POST":
        if profile_form.validate_on_submit():
            f = profile_form.profile_image.data
            filename = secure_filename(f.filename)
            # save file
            f.save(str(Path(PROFILE_DIR)/filename))
            session['profile_image'] = filename
            # flash("Success:"+filename, 'success')
            # redirect to desired endpoint

            return redirect(url_for('tryon'))

    profile_image = None
    if session_alive(PROFILE_DIR):
        profile_image = session['profile_image']
    return render_template('upload_profile_image.html',
                           form=profile_form, profile_image=profile_image)


@app.route('/upload_source_image/', methods=['GET', 'POST'])
def upload_source_image():
    source_form = SourceImageUploadForm()
    if request.method == "POST":
        print("Form Submitted")  # Debugging line
        if source_form.validate_on_submit():
            image = source_form.source_image.data
            filename = secure_filename(image.filename)
            print(f"Uploading image: {filename}")  # Debugging line
            image.save(str(Path(SOURCE_DIR)/filename))
            session['source_image'] = filename
            return redirect(url_for('upload_profile_image'))

    source_image = None
    if 'source_image' in session.keys():
        if (Path(SOURCE_DIR)/session['source_image']).exists():
            source_image = session['source_image']
    return render_template('upload_source_image.html',
                           form=source_form, source_image=source_image)


@app.route('/tryon/', methods=['GET', 'POST'])
def tryon():
    profile_image = "None"
    source_image = "None"
    result_image = "None"
    try:
        profile_image = session['profile_image']
        source_image = session['source_image']
        issues = ""
        print(f"Session source_image retrieved: {session.get('source_image')}")

        if len(issues) > 0:
            flash(issues, 'warning')
        
        # flash("Successful try on!", 'success')
    except Exception as e:
        flash(str(e), 'danger')

    return render_template('tryon_result_page.html',
                           profile_image=profile_image,
                           source_image=source_image,
                           result_image=result_image)

@app.route('/tryon_result/', methods=['GET', 'POST'])
def tryon_result():
    try:
        profile_image = session['profile_image']
        source_image = session['source_image']
        
        result_image, issues = blend_images(profile_image, source_image,
                                profile_dir=PROFILE_DIR,
                                source_dir=SOURCE_DIR,
                                dest_dir=RESULT_DIR)
        
        

        if len(issues) > 0:
            flash('\n'.join(issues), 'warning')
        
        # flash("Successful try on!", 'success')
    except Exception as e:
        flash(str(e), 'danger')
        result_image = ""

    return jsonify(result_image=result_image)


@app.route('/download/<path:filename>')
def download_file(filename):
    return send_from_directory(RESULT_DIR,
                               secure_filename(filename), as_attachment=True)

@app.route('/profile_images/<path:filename>')
def get_profile_image(filename):
    return send_from_directory(PROFILE_DIR, secure_filename(filename))


@app.route('/source_images/<path:filename>')
def get_source_image(filename):
    return send_from_directory(SOURCE_DIR, secure_filename(filename))


@app.route('/result_images/<path:filename>')
def get_result_image(filename):
    return send_from_directory(RESULT_DIR, secure_filename(filename))

@app.route('/sample_profile_images/', methods=['GET', 'POST'])
def sample_profile_images():
    sample_profile_images = [str(path.name) for path in (Path(app.static_folder)/'images'/'samples'/'profile_images').iterdir()]
    return jsonify(sample_profile_images=sample_profile_images[:5])


# @app.route('/sample_source_images/', methods=['GET', 'POST'])
# def sample_source_images():
#     sample_source_images = [str(path.name) for path in (Path(app.static_folder)/'images'/'samples'/'source_images').iterdir()]
#     return jsonify(sample_source_images=sample_source_images[:5])


@app.route('/pick_profile_image/<path:filename>', methods=['GET', 'POST'])
def pick_profile_image(filename):
    filename = secure_filename(filename)
    session['profile_image'] = filename
    return redirect(url_for('upload_source_image'))



# @app.route('/pick_source_image/<path:filename>', methods=['GET', 'POST'])
# def pick_source_image(filename):
#     filename = secure_filename(filename)
#     session['source_image'] = filename
#     return redirect(url_for('tryon'))




@app.route('/upload_product_image/', methods=['POST'])
def upload_product_image():
    SOURCE_DIR = Path('./files/user_uploads/source_images/')
    data = request.json
    image_data = data.get('imageUrl')

    if not image_data:
        return jsonify({'error': 'No image provided'}), 400

    try:
        # Check if the image data is base64 encoded
        if image_data.startswith('data:image/'):
            # Find the file format (e.g., jpeg, png) and the actual base64 data
            header, encoded = image_data.split(',', 1)
            file_extension = header.split('/')[1].split(';')[0]  # Extract the image format (jpeg, png, etc.)

            # Generate a unique filename using UUID
            unique_filename = secure_filename(f"{uuid.uuid4()}.{file_extension}")

            # Decode the base64 string
            image_bytes = base64.b64decode(encoded)

            # Save the decoded bytes to a file
            image_path = SOURCE_DIR / unique_filename
            with open(image_path, 'wb') as f:
                f.write(image_bytes)
            print('Image uploaded successfully',unique_filename)
            # Store the filename in the session
            session.clear()
            session['source_image'] = unique_filename
            print(f"Session source_image set to: {session['source_image']}")

            return jsonify({'message': 'Image uploaded successfully', 'filename': unique_filename}), 200
            
        else:
            print("Invalid image data")
            return jsonify({'error': 'Invalid image data'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500




# if __name__ == '__main__':
#     app.run()
