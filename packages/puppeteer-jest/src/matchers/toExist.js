export default function toExist(elementWrapper) {
  const pass = elementWrapper.exist();

  const contextualInformation = {};

  if (pass) {
    contextualInformation.actual = `Found Node: ${elementWrapper.html}`;
  }

  const selector = elementWrapper.selector;

  return {
    pass,
    message: `Expected "${selector}" to exist.`,
    negatedMessage: `Expected "${selector}" not to exist. Instead found 1 node.`,
    contextualInformation,
  };
}
