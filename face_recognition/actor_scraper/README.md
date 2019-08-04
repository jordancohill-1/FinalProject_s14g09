# Actor Scraper

## Introduction

This script scrapes a top 1000 IMDB page, extracting each actor's nconst, or
unique IMDB identifier, and name.

## Package Requirements

- request-promise
- cheerio
- fs

### Install Package Requirements

```
npm install
```

## Usage

```
node nconsts_scraper.js
```

### Example Output

```
[INIT] scraping nconsts...
[PROG] 100 of 1000 downloaded
...
[PROG] 1000 of 1000 downloaded
[DONE] nconsts written to file 'nconsts/nconsts.json'
```

### Options

```
const baseUrl = 'https://www.imdb.com/list/ls058011111/'
const totalPages = 10
const actorsPerPage = 100
const actorsFile = 'actors/actors.json'
```

- `baseUrl` - the URL of the list
- `totalPages` - the total pages of the list
- `actorsPerPage` - the number of actors on each page
- `actorsFile` - where the actor info will be written to
