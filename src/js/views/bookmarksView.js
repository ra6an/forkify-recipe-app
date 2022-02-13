import View from "./view";
import previewView from "./previewView";
import icons from '../../img/icons.svg';


class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks stored.';
    _message = '';

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    _generateMarkup() {
        // console.log(this._data);
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }
    
}

export default new BookmarksView();