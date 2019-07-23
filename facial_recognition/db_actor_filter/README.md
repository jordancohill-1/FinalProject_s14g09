# DB Actor Filter

NOTE: the `names.basics.csv` file needed for the script to work is not incuded
due to its size. It can be obtained [here](https://datasets.imdbws.com/)

## Introduction

This script filters the database, only looking for actors/actresses that are in
the `nconsts.json` file and exports the results to a CSV file.

## Package Requirements

- pandas

### Install Package Requirements

```
pip install -r requirements.txt
```

## Usage

```
python db_actor_filter.py
```

### Options

```
source_dataset = 'source_files/names.basics.csv'
nconsts_file = 'source_files/nconsts.json'
destination = 'dataset/imdb_actors.csv'
```

- `source_dataset` - the dataset to be filtered
- `nconsts_file` - file for actors/actresses to extract
- `destination` - where the csv file will be extracted to
