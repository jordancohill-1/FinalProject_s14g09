# Face Detection

## Introduction

Script that identifies actors in movie posters using face encodings from
database.

[Google Colab Link](https://colab.research.google.com/drive/1WU5M5NmJb6u-GubPX9ezyl05aWU9xgbx)

## Package Requirements

- psycopg2
- face_recognition
- opencv-python
- imutils

### Install Package Requirements

```
pip install -r requirements.txt
```

## Usage

```
python face_recog.py
```

### Options

```
# database
conn = psycopg2.connect("host=localhost port=5433 dbname=movie user=postgres")

# posters directory
posters_dir = '../../full'

```

- `conn` - database connection
- `images_dir` - directory where images are stored
