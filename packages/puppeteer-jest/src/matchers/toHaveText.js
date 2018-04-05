module.exports = function toHaveText(elementWrapper, text) {
  const actualText = elementWrapper.text;
  const selector = elementWrapper.selector;
  const wrapperHtml = elementWrapper.html;
  let pass;

  if (text === undefined) {
    pass = actualText.length > 0;
    return {
      pass,
      message: `Expected ${selector} node to have text, but it did not.`,
      negatedMessage: `Expected ${selector} node not to have text, but it did`,
      contextualInformation: {
        actual: `Actual HTML: "${wrapperHtml}"`,
      },
    };
  }

  pass = actualText === text;

  return {
    pass,
    message: `Expected ${selector} element text to match (using ===), but it did not.`,
    negatedMessage: `Expected ${selector} element text not to match (using ===), but it did.`,
    contextualInformation: {
      actual: `Actual HTML: "${actualText}"`,
      expected: `Expected HTML: "${text}"`,
    },
  };
}
