const getElement = require('./getElement');

module.exports = async (page, selector) => (await getElement(page, selector)) !== null;