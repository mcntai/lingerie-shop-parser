const pages = require('./pages')
const cheerio = require('cheerio')
const chalk = require('chalk')
const { listItemsHandler } = require('./handlers/listItemsHandler')
const { trimStr, p } = require('./helpers/common')
const storage = require('./helpers/storage')
const parallelLimit = require('./helpers/paralletLimit')
const fs = require('fs')
const grabData = require('./helpers/grabRequiredData')

const fetchProducts = () => {
  return parallelLimit(pages.map(page => {
    return () => listPageHandle(page)
  }), 10)
}

const listPageHandle = async (url) => {

  const pageContent = await p.getPageContent(url)
  const $ = cheerio.load(pageContent)
  let productItems = []

  $('._3mKI1').each((i, product) => {
    const url = $(product).attr('href')
    const productTitle = $(product).text()

    const title = trimStr(productTitle)

    productItems.push({
      title,
      url,
    })
  })
  await listItemsHandler(productItems)

  fs.writeFileSync('./data/db.json', JSON.stringify(storage.map((s) => grabData(s.product))))
}

fetchProducts().catch(console.error).finally(() => console.log(chalk.green('Completed!')))