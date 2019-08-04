window.initHappo = function(props) {
  window.happo = window.happo || {};
  window.happo.initChunk = function () {};

  var pagesIter = window.happoGatsbyPages.values();
  window.happo.nextExample = function () {
    var val = pagesIter.next();
    if (val.done) {
      return Promise.resolve(undefined);
    }
    props.navigate(val.value);
    return Promise.resolve({ component: val.value, variant: 'default' });
  };
}
