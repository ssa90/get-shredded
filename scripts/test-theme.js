import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  console.log('Navigating to http://localhost:5174/...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });

  const getComputedStyles = () => page.evaluate(() => {
    const body = document.body;
    const bodyBg = window.getComputedStyle(body).backgroundColor;
    const bodyColor = window.getComputedStyle(body).color;
    
    const appDiv = document.querySelector('.min-h-screen');
    const appBg = appDiv ? window.getComputedStyle(appDiv).backgroundColor : 'NOT_FOUND';
    const appColor = appDiv ? window.getComputedStyle(appDiv).color : 'NOT_FOUND';

    const rootVarBg = window.getComputedStyle(document.documentElement).getPropertyValue('--gray-950-rgb');

    return { bodyBg, bodyColor, appBg, appColor, rootVarBg };
  });

  console.log('Initial styles:', await getComputedStyles());

  console.log('Clicking Dark Mode...');
  await page.click('button[title="Dark Mode"]');
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('After Dark Mode click:', await getComputedStyles());

  console.log('Clicking Light Mode...');
  await page.click('button[title="Light Mode"]');
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('After Light Mode click:', await getComputedStyles());

  await browser.close();
  console.log('Test finished.');
})();
