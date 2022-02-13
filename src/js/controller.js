// import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

if(module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0)UPDATE SELECTED RECIPE////////////////////////////////////////////////////////////////////////////////////
    resultsView.update(model.getSearchResultsPage());
    
    // 1)UPDATING BOOKMARKS VIEW////////////////////////////////////////////////////////////////////////////////////
    bookmarksView.update(model.state.bookmarks);

    // 2)LOADING///////////////////////////////////////////////////////////////////////////////////////////////////
    await model.loadRecipe(id);
    
    // 3)RENDERING////////////////////////////////////////////////////////////////////////////////////////////////
    recipeView.render(model.state.recipe);
    
    // TEST/////////////////////
    // controlServings();
  } catch (err) {
    recipeView.renderError();
  }
};

const contolSearchResults = async function() {
  try {
    // resultsView._generateMarkup();

    // GET SEARCH QUERY///////////////////////////////////////////////////////////////////////////////////////////
    const query = searchView.getQuery();
    if(!query) return;

    // LOAD SEARCH RESULTS////////////////////////////////////////////////////////////////////////////////////////
    await model.loadSearchResults(`${query}`);

    // RENDER RESULTS/////////////////////////////////////////////////////////////////////////////////////////////
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // RENDER INITIAL PAGE BUTTONS////////////////////////////////////////////////////////////////////////////////
    paginationView.render(model.state.search);

  } catch (err) {
    console.log(err);
  }
};
// contolSearchResults();

const controlPagination = function(goToPage) {
  // RENDER NEW RESULTS////////////////////////////////////////////////////////////////////////////////////////////
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(goToPage));

    // RENDER NEW PAGinaton BUTTONS////////////////////////////////////////////////////////////////////////////////
    paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  // UPDATE THE RECIPE SERVINGS////////////////////////////////////////////////////////////////////////////////////
  model.updateServings(newServings);
  // UPDATE THE RECIPE VIEW////////////////////////////////////////////////////////////////////////////////////////
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
} 

const controlAddBookmark = function() {
  // ADD OR REMOVE BOOKMARK
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe)
  } else model.deleteBookmark(model.state.recipe.id);
  
  // UPDATE RECIPE VIEW
  recipeView.update(model.state.recipe);

  // RENDER BOOKMARKS
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try {
    addRecipeView.renderSpinner();

    // UPLOAD NEW RECIPE DATA/////////////////////////////////////////////////////////////////
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);
    // RENDER RECIPE//////////////////////////////////////////////////////////////////////////
    recipeView.render(model.state.recipe);

    // SUCCES MESSAGE/////////////////////////////////////////////////////////////////////////
    addRecipeView.renderMessage();

    // RENDER BOOKMARK VIEW///////////////////////////////////////////////////////////////////
    bookmarksView.render(model.state.bookmarks);

    // CHANGE ID IN URL///////////////////////////////////////////////////////////////////////
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // CLOSE WINDOW FORM//////////////////////////////////////////////////////////////////////
    setTimeout(function() {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);
  } catch(err) {
    console.error('💣', err);
    addRecipeView.renderError(err.message);
  }
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(contolSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

