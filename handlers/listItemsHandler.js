const cheerio = require('cheerio')
const chalk = require('chalk')
const { p } = require('../helpers/common')
const parallelLimit = require('../helpers/paralletLimit')
const storage = require('../helpers/storage')

const task = async initialData => {
  console.log(chalk.green(`Getting data from: `) + chalk.green.bold(initialData.url))
  const detailContent = await p.getPageContent(initialData.url)

  const $ = cheerio.load(detailContent)

  const sourceOfInfo = $('#wix-warmup-data')
  const rawData = sourceOfInfo[0].children[0].data

  const regEx = /(.+catalog":)(.+)(,"appSettings.+)/gm
  const afterTrim = JSON.parse(rawData.replace(regEx, '$2'))

  storage.push(afterTrim)
}

async function listItemsHandler(data) {
  return parallelLimit(data.map(initialData => {
    return () => task(initialData)
  }), 10)
}

module.exports = {
  listItemsHandler,
}