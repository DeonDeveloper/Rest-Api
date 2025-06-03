const puppeteer = require('puppeteer');

module.exports = function(app) {
  app.get('/api/stalk/mlbb-moba', async (req, res) => {
    const { userId, zoneId } = req.query;

    if (!userId || !zoneId) {
      return res.status(400).json({ status: false, message: 'Parameter userId dan zoneId dibutuhkan.' });
    }

    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.goto('https://www.mobapay.com/mlbb/?r=ID', { waitUntil: 'networkidle2' });

      await page.type('input[name="user_id"]', userId, { delay: 50 });
      await page.type('input[name="zone_id"]', zoneId, { delay: 50 });

      await page.waitForTimeout(3000);

      const nickname = await page.$eval('.el-input-group__append', el => el.textContent.trim());

      const promoStatus = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.recharge-item'));
        return items.map(el => {
          const denom = el.querySelector('.diamond-info')?.innerText.trim();
          const status = el.innerText.includes('Purchase limit reached') ? 'Nonactive' : 'Active';
          return { denom, status };
        }).filter(i => i.denom && i.denom.includes('+'));
      });

      await browser.close();

      return res.status(200).json({
        status: true,
        nickname,
        promoStatus
      });
    } catch (error) {
      console.error('Scrape error:', error.message);
      return res.status(500).json({ status: false, message: 'Scraper error: ' + error.message });
    }
  });
};
