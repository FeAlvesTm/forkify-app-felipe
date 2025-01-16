class SearchView {
  _parentElement = document.querySelector('.search');

  getPesquisa() {
    const pesquisa = this._parentElement.querySelector('.search__field').value;
    this.clear();
    return pesquisa;
  }
  clear() {
    return (this._parentElement.querySelector('.search__field').value = '');
  }
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
