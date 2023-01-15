import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountriesInput } from './js/countries';
import { createPreviousListCountry, createCardCountry } from './js/country-card';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputSearchEl: document.querySelector('input#search-box'),
    countryListEl: document.querySelector('.country-list'),
    countryInfoEl: document.querySelector('.country-info'),
};


refs.inputSearchEl.addEventListener('input', debounce(onInputfill, DEBOUNCE_DELAY));

function onInputfill(e) {
    const valueInput = e.target.value.trim().toLowerCase();
    console.log(valueInput);

    if (valueInput === '') {
        refs.countryListEl.innerHTML = '';
        refs.countryInfoEl.innerHTML = '';
        return;
    }

    fetchCountriesInput(valueInput)
        .then(countries => {
            console.log(countries)

            if (countries.length > 10) {
                refs.countryListEl.innerHTML = '';
                refs.countryInfoEl.innerHTML = '';
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
                return;
            }
            if (countries.length > 1 && countries.length <= 10) {
                const markupList = createPreviousListCountry(countries);
                refs.countryListEl.innerHTML = markupList;
                refs.countryInfoEl.innerHTML = '';
                return;
            }

            if (countries.length === 1) {
                const markupOneCountry = createCardCountry(countries[0]);
                refs.countryListEl.innerHTML = '';
                refs.countryInfoEl.innerHTML = markupOneCountry;
                return;
            }
        })

        .catch(err => {
            switch (err.message) {
                case '404': {
                    refs.countryListEl.innerHTML = '';
                    refs.countryInfoEl.innerHTML = '';
                    Notiflix.Notify.failure('Oops, there is no country with that name');
                    break;
                }
            }
        })

}