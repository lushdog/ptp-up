const puppeteer = require('puppeteer')

module.exports = async (imgs, config) => {

  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
  const page = await browser.newPage()
  await page.goto('https://ptpimg.me/index.php')

  await page.setViewport({
    width: 1366,
    height: 768 * 2
  })

  await page.evaluate((config) => {
    document.querySelector('#email').value = config.ptpimgEmail
    document.querySelector('#pass').value = config.ptpimgPassword
  }, config)

  await Promise.all([
    page.waitForNavigation(), // The promise resolves after navigation has finished
    page.click('.btn.btn-success'), // 点击该链接将间接导致导航(跳转)
  ])

  await page.evaluate(() => {
    document.querySelector('.nav.nav-tabs li:nth-child(2) a').click()
  })

  await page.waitFor(1000)
  
  await page.evaluate((imgs) => {
    console.log('imgs', imgs);
    document.querySelector('#link-upload').value = `${imgs[0]}\n${imgs[1]}\n${imgs[2]}\n${imgs[3]}`
    console.log('imgs input values', `${imgs[0]}\n${imgs[1]}\n${imgs[2]}\n${imgs[3]}`)
    // document.querySelector('#link-upload').value = `${'https://i.stack.imgur.com/wpAaZ.jpg'}`
    document.querySelector('#link .btn.btn-success').click()
  }, imgs)

  await page.waitFor(5000)

  const reslut = await page.$eval('#bbcode textarea', ele => ele.innerHTML)

  console.log('reslut', reslut);

  await browser.close()

  return reslut

}
