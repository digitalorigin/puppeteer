const getElement = require('./utils/getElement');
const hasElement = require('./utils/hasElement');
const getText = require('./utils/getText');
const isVisible = require('./utils/isVisible');
const getHtml = require('./utils/getHtml');
const getId = require('./utils/getId');
const isChecked = require('./utils/isChecked');
const getValue = require('./utils/getValue');
const getError = require('./utils/getError');
const clear = require('./utils/clear');
const element = require('./utils/element');

module.exports = page => ({
  getElement: getElement.bind(null, page),
  hasElement: hasElement.bind(null, page),
  getText: getText.bind(null, page),
  isVisible: isVisible.bind(null, page),
  getHtml: getHtml.bind(null, page),
  getId: getId.bind(null, page),
  isChecked: isChecked.bind(null, page),
  getValue: getValue.bind(null, page),
  getError: getError.bind(null, page),
  clear: clear.bind(null, page),
  element: element.bind(null, page),
});
