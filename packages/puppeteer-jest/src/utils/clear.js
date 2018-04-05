module.exports = async (page, selector) =>
  await page.$eval(selector, input => (input.value = ''));