'use strict';

const containerCards = document.querySelector('.cards');
const extensionsJson = './data.json';

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