module.exports = async (page, selector) => await page.$eval(selector, el => el.checked === true);
