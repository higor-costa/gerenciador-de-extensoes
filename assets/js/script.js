'use strict';

const containerCards = document.querySelector('.cards');
const extensionsJson = './data.json';
const toggleSwitch = document.querySelector('.header__theme-toggle input');
const iconToggleSwitch = document.querySelector('.header__theme-toggle img');
const logo = document.querySelector('.header__logo-icon');

const switchSrcImages = () => {
  const themeLight =
    document.documentElement.getAttribute('mode-light-dark') === 'light';

  if (themeLight) {
    iconToggleSwitch.src = './assets/images/icon-moon.svg';
    logo.src = './assets/images/logo.svg';
  } else {
    iconToggleSwitch.src = './assets/images/icon-sun.svg';
    logo.src = './assets/images/logo-dark.svg';
  }
};

toggleSwitch.addEventListener('change', () => {
  const mode = toggleSwitch.checked ? 'light' : 'dark';
  document.documentElement.setAttribute('mode-light-dark', mode);
  localStorage.setItem('theme', mode);
  switchSrcImages();
});

const fillExtensions = (extensions) => {
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
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        </div>
    `;
    containerCards.appendChild(card);
  });
};

const loadExtensions = async () => {
  try {
    const response = await fetch(extensionsJson);
    const data = await response.json();
    fillExtensions(data);
  } catch (error) {
    console.log('Erro ao carregar extesões: ' + error);
  }
};

loadExtensions();