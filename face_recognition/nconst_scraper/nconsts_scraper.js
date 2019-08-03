/*
*
* Extracts the nconst of each actor in the top 1000 imdb page
* Author: Phillip T.
*
*/

/////////////
// OPTIONS //
/////////////

const baseUrl = 'https://www.imdb.com/list/ls058011111/'
const totalPages = 10
const actorsPerPage = 100
const nconstFile = 'nconsts/nconsts.json'

////////////////////////////////////////////////////////////////////////////////

const rp = require('request-promise')
const $ = require('cheerio')
const fs = require('fs')

let nconsts = []
let operationsCompleted = 0;
let totalActors = totalPages * actorsPerPage;

const main = () => {
  console.log("[INIT] scraping nconsts...")
  getNconsts()
}

// extract nconst of each actor
const getNconsts = () => {
  // loop through all pages of the list
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    // format url for extration
    let url = `${baseUrl}?page=${pageNumber}`
    
    // extract nconst for each actor
    rp(url)
    .then(function(html){
      for (let i = 0; i < actorsPerPage; i++) {
        // scrape actor link and extract nconst to array
        nconsts.push($('.lister-item-image > a', html)[i].attribs.href
        .replace('/name/', '').replace('/?ref_=nmls_pst', ''))

        // increment operations counter
        operation()
      }
      // display progress to user
      console.log(`[PROG] ${nconsts.length} of ${totalActors} downloaded`)
    })
  }
}

// save nconsts to JSON file
const saveNconsts = () => {
  // convert nconsts to json
  const json = JSON.stringify(nconsts)

  // write to file
  fs.writeFileSync(nconstFile, json)

  // notify user
  console.log('[DONE] nconsts written to file', nconstFile)
  console.log(nconsts.length)
}

// when getNconsts done, run SaveNconsts
// hacky way not to use async or promises: https://stackoverflow.com/a/27914617
const operation = () => {
  // increment operations counter
  operationsCompleted++

  // once all nconsts are scraped, run SaveNConsts
  if (operationsCompleted === totalActors) saveNconsts(nconsts)
}

main()