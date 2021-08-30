const { PuppeteerHandler } = require('../helpers/puppeteer')
const p = new PuppeteerHandler()

const trimStr = string => {
  const regEx = /(НовинкаБыстрый просмотр)(.+)(Цена.+)/gm

  return string.replace(regEx, '$2')
}

module.exports = {
  trimStr,
  p,
}
