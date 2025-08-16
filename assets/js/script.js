'use strict';

const containerCards = document.querySelector('.cards');
const extensionsJson = './data.json';
const toggleSwitch = document.querySelector('.header__theme-toggle input');
const iconToggleSwitch = document.querySelector('.header__theme-toggle img');
const logo = document.querySelector('.header__logo-icon');
const btnFilter = document.querySelectorAll('.extensions__filters-button');
let extensionsData = [];
let currentFilter = 'all';

const removeExtensions = ({ target }) => {
  const index = target.dataset.index;
  extensionsData.splice(index, 1);
  localStorage.setItem('Extensions', JSON.stringify(extensionsData));
  renderCurrent();
}

const switchSrcImages = () => {
  const themeLight =
    document.documentElement.getAttribute('mode-light-dark') === 'light';

    iconToggleSwitch.src = themeLight
    ? './assets/images/icon-moon.svg'
    : './assets/images/icon-sun.svg';
    logo.src = themeLight
    ? './assets/images/logo.svg'
    : './assets/images/logo-dark.svg';
};

toggleSwitch.addEventListener('change', () => {
  const mode = toggleSwitch.checked ? 'light' : 'dark';
  document.documentElement.setAttribute('mode-light-dark', mode);
  localStorage.setItem('theme', mode);
  switchSrcImages();
});

const clearCards = () => {
  containerCards.innerHTML = '';
}

const fillExtensions = (extensions) => {
  clearCards();
  extensions.forEach((extension, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card__information">
          <img src="${extension.logo}" alt="${extension.name} logo" class="card__logo">
          <div class="card__text">
            <h3 class="card__name">${extension.name}</h3>
            <p class="card__description">${extension.description}</p>
          </div>
        </div>
        <div class="card__buttons">
          <button class="card__button-remove" data-index="${index}">Remove</button>
          <label class="card__button-status">
            <input type="checkbox" ${extension.isActive ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
    `;

    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      extension.isActive = checkbox.checked;
      localStorage.setItem('Extensions', JSON.stringify(extensionsData));
      renderCurrent();
    })
    containerCards.appendChild(card);
  });
};

const switchClass = (button) => {
  btnFilter.forEach(btn => btn.classList.remove('extensions__filters-button--active'));
  button.classList.add('extensions__filters-button--active');
}

const renderCurrent = () => {
  let filtered = extensionsData;

  if (currentFilter === 'active') {
    filtered = extensionsData.filter(e => e.isActive);
  } else if (currentFilter === 'inactive'){
    filtered = extensionsData.filter(e => !e.isActive);
  }

  fillExtensions(filtered)
  addEventRemove();
}

const filters = (button) => {
  currentFilter = button.dataset.filter || 'all';
  switchClass(button);
  renderCurrent();
}

const loadExtensions = async () => {
  try {
    const savedData = localStorage.getItem('Extensions');

    if (savedData) {
      extensionsData = JSON.parse(savedData);
    } else {
      const response = await fetch(extensionsJson);
      if (!response.ok) {
        throw new Error(`HTTP error: status ${response.status}`);
      }
      extensionsData = await response.json();
      localStorage.setItem('Extensions', JSON.stringify(extensionsData));
    }
    renderCurrent();
  } catch (error) {
    console.error('Erro ao carregar extensões: ' + error);
  }
};

const addEventRemove = () => {
  const btnRemove = containerCards.querySelectorAll('.card__button-remove');
  btnRemove.forEach((btn) => {
    btn.addEventListener('click', removeExtensions);
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('mode-light-dark', savedTheme);
  toggleSwitch.checked = savedTheme === 'light';
  loadExtensions();
  switchSrcImages();
  addEventRemove();
});

btnFilter.forEach((button) => {
  button.addEventListener('click', () => filters(button));
});