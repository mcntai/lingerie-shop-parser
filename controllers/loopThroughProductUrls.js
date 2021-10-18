const cheerio = require('cheerio')
const chalk = require('chalk')
const { parallelLimit } = require('async')
const { p } = require('../helpers/common')
const storage = require('../helpers/storage')

const getProductContent = async productUrl => {
  console.log(chalk.green(`Getting data from: `) + chalk.green.bold(productUrl))

  try {
    const pageContent = await p.getPageContent(productUrl)
    const $ = cheerio.load(pageContent)

    const sourceOfProductDetails = $('#wix-warmup-data')
    const rawData = sourceOfProductDetails[0].children[0].data

    const regEx = /(.+catalog":)(.+)(,"appSettings.+)/gm
    const dataAfterClearing = JSON.parse(rawData.replace(regEx, '$2'))

    storage.push(dataAfterClearing)
  } catch (err) {
    console.error(err)
  }
}

async function loopThroughProductUrls(data) {
    return parallelLimit(data.map(product => {
      return async () => await getProductContent(product)
    }), 5)
}

module.exports = loopThroughProductUrls
