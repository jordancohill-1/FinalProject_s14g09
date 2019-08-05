# Face Encoder

## Introduction

Generates face encodings from image and creates DB entry with related actor
information.

[Google Colab Link](https://colab.research.google.com/drive/1T_Su2-8n3icz2TQ62oyKiwH8f1Iyawhg)

## Package Requirements

- psycopg2
- face_recognition

### Install Package Requirements

```
pip install -r requirements.txt
```

## Usage

```
python face_encoder.py
```

### Options


```
# database
conn = psycopg2.connect(database='s14g09_IMDB_ColorPrediction', user='s14g09', password="s14g09_Master", host='movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com', port='5432')

# faces directory
faces_dir = 'faces'

# actors file
actors_file = 'actors/actors.json'
```

- `conn` - connection info for the database
- `faces_dir` - where the actor faces are stored
- `actors_file` - where the actor info is stored 
