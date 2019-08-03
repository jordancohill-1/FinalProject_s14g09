# Nconst Scraper

## Introduction

The `nconst` is the unique identifier that IMDB assigns to each actor. This
script is meant to scrape the `nconst` of the `top 1000 actors` in IMDB and
write the results to a `nconsts.json` file. These `nconst` values will later be
used to scrape the image of each actor.

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
const nconstFile = 'nconsts/nconsts.json'
```

- `baseUrl` - the URL of the list
- `totalPages` - the total pages of the list
- `actorsPerPage` - the number of actors on each page
- `nconstFile` - where the nconsts will be written to
