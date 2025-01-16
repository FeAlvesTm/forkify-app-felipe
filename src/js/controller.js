import * as model from './model.js';
import * as config from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import resultsView from './views/resultsView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');
// const btn = document.querySelector('.botao');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io/api/v2/recipes/

///////////////////////////////////////

const controlarReceitas = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    recipeView.mostrarSpinner();

    resultsView.update(model.getSearchResultsPage());
    // 1) CARREGANDO RECEITA
    await model.loadRecipe(id);

    // 2) RENDERIZANDO RECEITA
    recipeView.render(model.state.recipe);

    bookmarkView.update(model.state.bookmarks);
  } catch (err) {
    console.error(err.message);
    recipeView.renderError(err);
  }
};

const controlarResultadoPesquisa = async function () {
  try {
    ResultsView.mostrarSpinner();

    const pesquisa = searchView.getPesquisa();
    if (!pesquisa) return;

    await model.carregarResultadosPesquisa(pesquisa);
    console.log(model.state.search.results);
    ResultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err.message);
  }
};
const controlPagination = function (goToPage) {
  ResultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else {
    model.deleteBookMark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);
    window.history.pushState(null, '', `${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, config.MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlarReceitas);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlarResultadoPesquisa);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
// window.addEventListener('hashchange', controlarReceitas);
// window.addEventListener('load', controlarReceitas);
