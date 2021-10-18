const fs = require('fs')
const cheerio = require('cheerio')
const chalk = require('chalk')
const { parallelLimit } = require('async')
const loopThroughProductUrls = require('./controllers/loopThroughProductUrls')
const { getCurrentPaginationNum, getUrlOfNextPage, p } = require('./helpers/common')
const selectRequiredData = require('./controllers/selectRequiredData')
const productPages = require('./helpers/productPages')
const storage = require('./helpers/storage')

const startTime = new Date()

const loopThroughPages = () => {
  console.log(chalk.red.bold(startTime))

  return parallelLimit(productPages.map(page => {
    return async () => await collectProductsFromPage(page)
  }), 5)
}

const collectProductsFromPage = async categoryPage => {
  console.log(chalk.yellowBright(`Getting data from: `) + chalk.yellowBright.bold(categoryPage))

  const pageContent = await p.getPageContent(categoryPage)
  const $ = cheerio.load(pageContent)

  const quantityOfPagination = Number($('.s1a5ir').find('*').last().text()) || 1
  const curPaginationNum = getCurrentPaginationNum(categoryPage)

  let linksToProducts = []

  $('._3mKI1').each((i, product) => {
    const productLink = $(product).attr('href')

    linksToProducts.push(productLink)
  })

  if (curPaginationNum !== quantityOfPagination) {
    await collectProductsFromPage(decodeURIComponent(getUrlOfNextPage(categoryPage)))
  }

  await loopThroughProductUrls(linksToProducts)
}

loopThroughPages().catch(console.error).finally(() => {
  fs.writeFileSync('./db/db.json', JSON.stringify(storage.map((s) => selectRequiredData(s.product))))

  console.log(chalk.red.bold(new Date()))
  console.log(chalk.green.bold(`Work completed!`))
})
