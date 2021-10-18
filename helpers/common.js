const { PuppeteerHandler } = require('../helpers/puppeteer')
const { URL } = require('url')
const p = new PuppeteerHandler()

const getUrlOfNextPage = curPaginationUrl => {
  const curPage = new URL(curPaginationUrl)
  const curPaginationNumber = Number(curPage.searchParams.get('page'))
  curPage.search = `page=${curPaginationNumber + 1}`

  return curPage.href
}

const getCurrentPaginationNum = curPaginationUrl => {
  const curPage = new URL(curPaginationUrl)
  return Number(curPage.searchParams.get('page'))
}

module.exports = {
  getUrlOfNextPage,
  getCurrentPaginationNum,
  p,
}
