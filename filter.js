const HAPPO_PAGES = process.env.HAPPO_PAGES
  ? JSON.parse(process.env.HAPPO_PAGES)
  : undefined;

module.exports = {
  onCreatePage: ({ page, actions }) => {
    if (!HAPPO_PAGES) {
      // not a happo run
      return;
    }
    if (HAPPO_PAGES.includes(page.path)) {
      // page is part of happo run
      return;
    }
    console.log(
      `(happo) Skipping ${page.path} as it's not part of the happo run`,
    );
    actions.deletePage(page);
  },

  createPageFilter: createPage => {
    if (!HAPPO_PAGES) {
      // not a happo run
      return createPage;
    }
    return page => {
      if (HAPPO_PAGES.includes(page.path)) {
        return createPage(page);
      }
      console.log(
        `(happo) Skipping ${page.path} as it's not part of the happo run`,
      );
    };
  },
};
