# Projeto de Web Scraping para Netshoes

Este projeto realiza scraping de dados da página da Netshoes, extrai informações sobre produtos e as salva em um banco de dados SQLite e em um arquivo CSV.

## Requisitos

- Node.js (versão 14 ou superior)
- npm (Node Package Manager)

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <NOME_DO_DIRETORIO>

Instale as dependências:

Navegue até o diretório do projeto e execute o comando:

bash
Copiar código
npm install
Este comando instalará todas as dependências necessárias listadas no package.json.

Executando o Código
Inicie o script de scraping:

Para iniciar o scraping, execute o script scraping.js com o Node.js:

bash
Copiar código
node scraping.js
Interação com o Usuário:

O script solicitará que você forneça uma URL de produto específica ou a URL da página principal. Insira a URL conforme solicitado.

Para uma URL de produto específica: Digite a URL completa do produto.
Para a URL da página principal: Digite "main" para permitir que o script faça scraping de todos os links de produtos na página principal.
Exemplo:

URL de produto: <https://www.netshoes.com.br/p/tenis-asics-gelpulse-15-se-masculino-laranja+preto-2FW-1698-206>
Página principal: <https://www.netshoes.com.br/>
Testando o Código
Para testar o código:

Execute o script com uma URL de produto:

Verifique se o script coleta e salva as informações do produto corretamente no banco de dados SQLite e no arquivo CSV.

Execute o script com a URL da página principal:

Verifique se o script coleta e salva os dados de vários produtos corretamente.

Verifique o Banco de Dados SQLite:
O banco de dados netshoes.db deve ser criado no diretório do projeto. Você pode usar um visualizador de SQLite para inspecionar os dados inseridos.

Verifique o Arquivo CSV:
O arquivo scraping_results.csv deve ser criado no diretório do projeto e conter os dados dos produtos coletados.

Estrutura do Projeto

scraping.js:
 Script principal para realizar o scraping e salvar dados.

netshoes.db:
 Banco de dados SQLite onde os dados dos produtos são armazenados.

scraping_results.csv:
Arquivo CSV onde os dados dos produtos são também armazenados.

