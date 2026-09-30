from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, URL, Optional


class ProfileImageUploadForm(FlaskForm):
    profile_image = FileField('profile_image',id="profile_image",
                              validators=[FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')])
    submit = SubmitField('Next >',id="submit")


class SourceImageUploadForm(FlaskForm):
    source_image = FileField('source_image',id="source_image",
                              validators=[FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')])
    submit = SubmitField('Submit', id="submit")


