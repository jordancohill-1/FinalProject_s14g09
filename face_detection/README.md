# Face Detection

## Introduction

Script that uses Dlib's CNN face detection to find faces in movie posters.

[Google Colab Link](https://colab.research.google.com/drive/1VFrcniIjjWdVoouzlqKBsgxjQGazubgT)

## Package Requirements

- psycopg2
- pandas
- face_recognition
- pillow

### Install Package Requirements

```
pip install -r requirements.txt
```

## Usage

```
python face_detection.py
```

### Options

```
# database
conn = psycopg2.connect("host=localhost port=5433 dbname=movie user=postgres")

# images directory
image_dir = "../full"

```

- `conn` - database connection
- `images_dir` - directory where images are stored
