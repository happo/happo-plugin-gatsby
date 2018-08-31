const examples = HAPPO_GATSBY_PAGES.map(({ component, content }) => {
  return {
    component,
    variants: {
      default: () => {
        document.body.innerHTML = content;
      },
    },
  };
});

module.exports = examples;
