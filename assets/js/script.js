'use strict';

const containerCards = document.querySelector('.cards');
const extensionsJson = './data.json';
const toggleSwitch = document.querySelector('.header__theme-toggle input');
const iconToggleSwitch = document.querySelector('.header__theme-toggle img');
const logo = document.querySelector('.header__logo-icon');
const btnFilter = document.querySelectorAll('.extensions__filters-button');
let extensionsData = [];
let currentFilter = 'all';

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
  extensions.forEach((extension) => {
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
          <button class="card__button-remove">Remove</button>
          <label class="card__button-status">
            <input type="checkbox" ${extension.isActive ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
    `;

    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      extension.isActive = checkbox.checked;
      localStorage.setItem('Extensions', JSON.stringify(extensions));
    })
    containerCards.appendChild(card);
  });
};

const loadExtensions = async () => {
  try {
    let extensionsData;

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
    fillExtensions(extensionsData);
  } catch (error) {
    console.error('Erro ao carregar extesões: ' + error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('mode-light-dark', savedTheme);
  toggleSwitch.checked = savedTheme === 'light';
  loadExtensions();
  switchSrcImages();
});
