// Importa as regras padrão do ESLint para JavaScript moderno
import js from '@eslint/js';

// Importa conjuntos de variáveis globais comuns (como window, document, etc.)
import globals from 'globals';

// Define a configuração usando o novo formato do ESLint (modular e moderno)
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'], // Aplica as regras abaixo a todos os arquivos JS, MJS e CJS
    plugins: { js }, // Ativa o plugin oficial de JavaScript (regras da linguagem)
    extends: ['js/recommended'], // Usa o conjunto de regras recomendadas do ESLint para JavaScript
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.browser }, // Sinaliza para o ESLint que estamos rodando JS no navegador
  },
  {
    rules: {
      'no-undef': 0, // Desativa a regra que impede o uso de variáveis não declaradas
    },
  },
]);
