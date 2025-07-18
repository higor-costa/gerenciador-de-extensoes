// Importa o módulo 'path' do Node.js para trabalhar com caminhos de arquivos de forma segura
const path = require('path');

module.exports = {
  // Define o ponto de entrada da aplicação
  // É o arquivo principal que o Webpack vai ler para começar o empacotamento
  entry: './assets/js/script.js',
  // Define onde o Webpack vai salvar o arquivo final empacotado (bundle)
  output: {
    // Cria um caminho absoluto para a pasta 'dist'
    path: path.resolve(__dirname, 'dist'),
    // Nome do arquivo final gerado após o build
    filename: 'main.js',
  },
  // Define o modo build
  // Development = mais rápido, não minifica, útil durante o desenvolvimento
  // production = minificado e otimizado para produção
  mode: 'development',

  // Configuração de módulos: define como arquivos diferentes devem ser tratados
  module: {
    rules: [
      {
        // Aplica essa regra para todos os arquivos que terminem com .js
        test: /\.js$/,

        // Exclui arquivos dentro da pasta node_modules (não precisamos processá-los)
        exclude: /node_modules/,

        // Define qual loader usar para processar os arquivos .js
        use: {
          loader: 'babel-loader', // Usa o Babel para transpilar o código JS
          options: {
            // Preset que converte JS moderno para versões antigas compatíveis com mais navegadores
            presets: ['@babel/preset-env'],

            // Plugin que evita duplicação de helpers (como funções async/await, etc.)
            // Isso otimiza o código gerado
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
};
