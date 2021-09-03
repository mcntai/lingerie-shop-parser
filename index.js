const fs = require('fs')
const cheerio = require('cheerio')
const chalk = require('chalk')
const parallelLimit = require('./helpers/paralletLimit')
const loopThroughProductUrls = require('./controllers/loopThroughProductUrls')
const p = require('./helpers/common')
const selectRequiredData = require('./controllers/selectRequiredData')
const productPages = require('./helpers/productPages')
const storage = require('./helpers/storage')

const startTime = new Date()

const loopThroughPages = () => {
  console.log(chalk.red.bold(startTime))

  return parallelLimit(productPages.map(page => {
    return () => collectProductsFromPage(page)
  }), 5)
}

const collectProductsFromPage = async url => {
  console.log(chalk.yellowBright(`Getting data from: `) + chalk.yellowBright.bold(url))

  const pageContent = await p.getPageContent(url)
  const $ = cheerio.load(pageContent)

  const currentPaginationNumber = Number(url.slice(-1))
  const quantityOfPagesInPagination = Number($('.s1a5ir').find('*').last().text())

  let linksToProducts = []

  $('._3mKI1').each((i, product) => {
    const url = $(product).attr('href')

    linksToProducts.push(url)
  })

  if (currentPaginationNumber !== quantityOfPagesInPagination) {
    await collectProductsFromPage(url.replace(/\d$/gm, currentPaginationNumber + 1))
  }

  await loopThroughProductUrls(linksToProducts)
}

loopThroughPages().catch(console.error).finally(() => {
  fs.writeFileSync('./db/db.json', JSON.stringify(storage.map((s) => selectRequiredData(s.product))))

  console.log(chalk.red.bold(new Date()))
  console.log(chalk.green.bold(`Work completed. Finally`))
})
