
module.exports = async (page, selector) =>
  page.$eval(selector, el => {
    if (!el) {
      return false;
    }
    const style = window.getComputedStyle(el);
    return (
      style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
    );
  });
