const puppeteer = require('puppeteer')

const LAUNCH_PUPPETEER_OPTS = {
  args: [
    '--single-process',
    '--no-zygote',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920x1080',
  ],
}

const PAGE_PUPPETEER_OPTS = {
  waitUntil          : 'load',
  timeout            : 0,
}

class PuppeteerHandler {
  constructor() {
    this.browser = null
  }

  async initBrowser() {
    this.browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS)
  }

  closeBrowser() {
    this.browser.close()
  }

  async getPageContent(url) {
    if (!this.browser) {
      await this.initBrowser()
    }

    try {
      const page = await this.browser.newPage()
      await page.goto(url, PAGE_PUPPETEER_OPTS)
      const content = await page.content()
      await page.close()
      return content
    } catch (err) {
      throw err
    }
  }
}

module.exports = {
  LAUNCH_PUPPETEER_OPTS,
  PAGE_PUPPETEER_OPTS,
  PuppeteerHandler
}