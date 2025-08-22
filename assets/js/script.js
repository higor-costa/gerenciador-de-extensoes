'use strict'; // Força o uso de boas práticas, evitando variáveis globais implícitas

// Seletores principais
const containerCards = document.querySelector('.cards');
const extensionsJson = './data.json';
const toggleSwitch = document.querySelector('.header__theme-toggle input');
const iconToggleSwitch = document.querySelector('.header__theme-toggle img');
const logo = document.querySelector('.header__logo-icon');
const btnFilter = document.querySelectorAll('.extensions__filters-button');

// Variáveis de controle
let extensionsData = []; // Armazena todas as extensões
let currentFilter = 'all'; // Filtro inicial (todas as extensões)

// Remove uma extensão pelo índice
const removeExtensions = ({ target }) => {
  const index = target.dataset.index; // índice salvo no botão
  extensionsData.splice(index, 1); // Remove do array
  localStorage.setItem('Extensions', JSON.stringify(extensionsData)); // Atualiza no localStorage
  renderCurrent(); // Re-renderiza os cards
}

// Alterna os ícones conforme o tema (claro/escuro)
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

// Alterna tema ao clicar no toggle
toggleSwitch.addEventListener('change', () => {
  const mode = toggleSwitch.checked ? 'light' : 'dark';
  document.documentElement.setAttribute('mode-light-dark', mode);
  localStorage.setItem('theme', mode); // persiste no localStorage
  switchSrcImages(); // Atualiza ícones
});

// Limpas os cards do contêiner
const clearCards = () => {
  containerCards.innerHTML = '';
}

// Renderiza todas as extensões passadas
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

    // Evento ao checkbox de ativar/desativar extensão
    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      extension.isActive = checkbox.checked; // atualiza no objeto
      localStorage.setItem('Extensions', JSON.stringify(extensionsData)); // salva
      setTimeout(() => {
          renderCurrent(); // re-renderiza com delay para efeito visual
      }, 500);
    })
    containerCards.appendChild(card);
  });
};

// Altera a classe ativa dos filtros
const switchClass = (button) => {
  btnFilter.forEach(btn => btn.classList.remove('extensions__filters-button--active'));
  button.classList.add('extensions__filters-button--active');
}

// rederiza extensões com base no filtro atual
const renderCurrent = () => {
  let filtered = extensionsData;

  if (currentFilter === 'active') {
    filtered = extensionsData.filter(e => e.isActive);
  } else if (currentFilter === 'inactive'){
    filtered = extensionsData.filter(e => !e.isActive);
  }

  fillExtensions(filtered)
  addEventRemove(); // Adiciona eventos nos botões de remoção
}

const filters = (button) => {
  currentFilter = button.dataset.filter || 'all';
  switchClass(button); // muda a classe ativa
  renderCurrent(); // re-renderiza os cards
}

// carrega extensões do arquivo JSON ou do localStorage
const loadExtensions = async () => {
  try {
    const savedData = localStorage.getItem('Extensions');

    if (savedData) {
      extensionsData = JSON.parse(savedData); // Pega do Storage
    } else {
      const response = await fetch(extensionsJson); // Busca JSON externo
      if (!response.ok) {
        throw new Error(`HTTP error: status ${response.status}`);
      }
      extensionsData = await response.json(); // Converte objeto em JSON
      localStorage.setItem('Extensions', JSON.stringify(extensionsData)); // Salva no Storage
    }
    renderCurrent();
  } catch (error) {
    console.error('Erro ao carregar extensões: ' + error);
  }
};


// Adiciona evento de remover para todos os botões "remove"
const addEventRemove = () => {
  const btnRemove = containerCards.querySelectorAll('.card__button-remove');
  btnRemove.forEach((btn) => {
    btn.addEventListener('click', removeExtensions);
  })
}

// Inicialização de aplicação
document.addEventListener('DOMContentLoaded', () => {
  // Pega tema salvo ou define como dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('mode-light-dark', savedTheme);
  toggleSwitch.checked = savedTheme === 'light';
  loadExtensions(); // Carrega extensões
  switchSrcImages(); // Define ícones corretos
  addEventRemove(); // Ativa botões de remoção
});

// Adiciona eventos para os filtros
btnFilter.forEach((button) => {
  button.addEventListener('click', () => filters(button));
});