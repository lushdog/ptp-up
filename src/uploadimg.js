const puppeteer = require('puppeteer')
const config = require('../config.json')

module.exports = async imgs => {

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://ptpimg.me/index.php')

  await page.setViewport({
    width: 1366,
    height: 768 * 2
  })

  await page.evaluate(() => {
    document.querySelector('#email').value = config.ptpimgEmail
    document.querySelector('#pass').value = config.ptpimgPassword
  })

  await Promise.all([
    page.waitForNavigation(), // The promise resolves after navigation has finished
    page.click('.btn.btn-success'), // 点击该链接将间接导致导航(跳转)
  ])

  await page.evaluate(() => {
    document.querySelector('.nav.nav-tabs li:nth-child(2) a').click()
  })

  await page.waitFor(1000)
  
  await page.evaluate(() => {
    document.querySelector('#link-upload').value = `${imgs[0]}\n${imgs[1]}\n${imgs[2]}\n${imgs[3]}`
    // document.querySelector('#link-upload').value = `${'https://i.stack.imgur.com/wpAaZ.jpg'}`
    document.querySelector('#link .btn.btn-success').click()
  })

  await page.waitFor(5000)

  const reslut = await page.$eval('#bbcode textarea', ele => ele.innerHTML)

  await page.screenshot({ path: 'example.png' })

  await browser.close()

  return reslut

}
