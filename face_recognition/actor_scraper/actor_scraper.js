/*
*
* Actor Scraper
* Extracts actor info from top 1000 imdb page
* Author: Phillip T.
*
*/

/////////////
// OPTIONS //
/////////////

const baseUrl = 'https://www.imdb.com/list/ls058011111/'
const totalPages = 10
const actorsPerPage = 100
const actorsFile = 'actors/actors.json'

////////////////////////////////////////////////////////////////////////////////

const rp = require('request-promise')
const $ = require('cheerio')
const fs = require('fs')

let actors = []
let operationsCompleted = 0;
let totalActors = totalPages * actorsPerPage;

const main = () => {
  console.log("[INIT] scraping actors...")
  getActors()
}

// get actor info
const getActors = () => {
  // loop through all pages of the list
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    // format url for extration
    let url = `${baseUrl}?page=${pageNumber}`
    
    // extract actor info for each page
    rp(url)
    .then(function(html){
      for (let i = 0; i < actorsPerPage; i++) {
        // create actor object
        let actor = {}

        // extract nconst, add to object
        actor['nconst'] = $('.lister-item-image > a', html)[i].attribs.href
        .replace('/name/', '').replace('/?ref_=nmls_pst', '')

        // extract name, add to object
        actor['name'] = $('.lister-item-header a', html).eq(i).text().trim()

        // push object to array
        actors.push(actor)

        // increment operations counter
        operation()
      }

      // display progress to user
      console.log(`[PROG] ${actors.length} of ${totalActors} processed`)
    })
  }
}

// save actors to JSON file
const saveActors = () => {
  // convert actors to json
  const json = JSON.stringify(actors)

  // write to file
  fs.writeFileSync(actorsFile, json)

  // notify user
  console.log('[DONE] actors written to file', actorsFile)
  console.log(actors.length)
}

// when getNconsts done, run SaveNconsts
// hacky way not to use async or promises: https://stackoverflow.com/a/27914617
const operation = () => {
  // increment operations counter
  operationsCompleted++

  // once all actors are scraped, run saveActors
  if (operationsCompleted === totalActors) saveActors(actors)
}

main()