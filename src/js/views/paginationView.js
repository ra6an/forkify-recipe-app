import View from "./view";
import icons from '../../img/icons.svg';


class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            const btn = e.target.closest('.btn--inline');

            if(!btn) return;

            const goToPage = +btn.dataset.goto;
            console.log(goToPage);
            handler(goToPage);
        })
    }

    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        console.log(numPages);
        // PAGE 1, THERE ARE OTHER PAGES////////////////////////////////
        if(curPage === 1 && numPages > 1) {
            return `
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }
        
        //  LAST PAGE///////////////////////////////////////////////////
        if(curPage === numPages && numPages > 1) {
            return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
            </button>
            `;
        }
        // OTHER PAGES//////////////////////////////////////////////////
        if(curPage < numPages) {
            return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
            </button>
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button>
            `;
            // PAGE 1, THERE ARE NO OTHER PAGES/////////////////////////////

            return '';
        }
    }
}

export default new PaginationView();