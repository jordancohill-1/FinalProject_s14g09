# IMDBvis Website

https://imdbvis.herokuapp.com/

## Development

1. Create virtual environment:

```
virtualenv env
```

2. Install dependencies

```
pip install -r requirements.txt
```

3. export FLASK_APP

```
export FLASK_APP=routes.py
```

4. Run app

```
flask run
```

## Deployment

You must push the subfolder to heroku in order to deploy the repo. Head to the
root of the repo and use this command:

```
git subtree push --prefix website heroku master
```