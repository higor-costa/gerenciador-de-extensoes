'use strict';

const containerCards = document.querySelector('.cards');
const extensionsJson = './data.json';

const loadExtensions = async () => {
  try {
    const response = await fetch(extensionsJson);
    const data = await response.json();
  } catch (error) {
    console.log('Erro ao carregar extesões: ' + error);
  }
};

loadExtensions();