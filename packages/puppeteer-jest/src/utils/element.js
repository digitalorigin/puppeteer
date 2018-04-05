module.exports = async (page, selector) => {
  let el;
  const update = async () => {
    try {
      el = await page.$eval(selector, el => ({
        id: el.id,
        text: el.innerText,
        html: el.outerHTML,
        checked: el.checked === true,
        value: el.value,
      }));
    } catch (e) {
      el = null;
    }
  };
  const clear = async () => await page.$eval(selector, input => (input.value = ''));

  await update();

  return {
    get id() {
      return el && el.id;
    },
    get text() {
      return el && el.text;
    },
    get html() {
      return el && el.html;
    },
    get checked() {
      return el && el.checked;
    },
    get value() {
      return el && el.value;
    },
    get selector() {
      return selector;
    },
    exist() {
      return el !== null;
    },
    async clear() {
      await clear();
      await update();
    },
    async type(text) {
      await page.type(selector, text);
      await update();
    },
    update,
  };
};
