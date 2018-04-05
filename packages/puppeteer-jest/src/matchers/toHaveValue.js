module.exports = function toHaveValue(elementWrapper, expectedValue)  {
  let pass = false;

  const value = elementWrapper.value;
  const wrapperName = elementWrapper.selector;
  const wrapperHtml = elementWrapper.html;

  pass = value === expectedValue;

  return {
    pass,
    message: `Expected ${wrapperName} element to have the value of "${expectedValue}" (using ===), but it didn't.`,
    negatedMessage: `Expected ${wrapperName} element not to have the value of "${expectedValue}" (using ===), but it did.`,
    contextualInformation: {
      actual: wrapperHtml,
    },
  };
}
