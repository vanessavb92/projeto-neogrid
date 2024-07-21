const axios = require('axios');
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const readline = require('readline');
const { Parser } = require('json2csv'); 

// Conectando ao banco de dados SQLite
const db = new sqlite3.Database('./netshoes.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criando a tabela se não existir
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS scraping_netshoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    preco TEXT,
    titulo TEXT,
    descricao TEXT,
    imagem TEXT
  )`);
});

// Função para fazer o scraping da página do produto
async function scrapeProduct(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const titulo = $('h1.product-title').text().trim();
        const preco = $('span.price').text().trim();
        const descricao = $('div.product-description').text().trim();
        const imagem = $('img.product-image').attr('src');

        if (!titulo || !preco || !descricao || !imagem) {
            console.log('Dados incompletos ou não encontrados.');
            console.log('Título:', titulo);
            console.log('Preço:', preco);
            console.log('Descrição:', descricao);
            console.log('Imagem:', imagem);
            return;
        }

        const produto = { preco, titulo, descricao, imagem };

        // Adicionando logs para verificar os dados
        console.log('Produto:', produto);

        // Inserindo os dados no banco de dados
        const stmt = db.prepare("INSERT INTO scraping_netshoes (preco, titulo, descricao, imagem) VALUES (?, ?, ?, ?)");
        stmt.run(produto.preco, produto.titulo, produto.descricao, produto.imagem, function (err) {
            if (err) {
                return console.log('Erro ao inserir dados:', err.message);
            }
            console.log(`Produto inserido com sucesso! ID: ${this.lastID}`);
        });
        stmt.finalize();

        // Adicionando dados ao arquivo CSV
        const csvParser = new Parser();
        const csv = csvParser.parse([produto]);

        fs.appendFile('scraping_results.csv', csv + '\n', (err) => {
            if (err) {
                console.error('Erro ao salvar no arquivo CSV:', err.message);
            } else {
                console.log('Dados salvos no arquivo CSV com sucesso.');
            }
        });

    } catch (error) {
        console.error('Erro ao fazer o scraping:', error);
    }
}

// Função para fazer o scraping da página principal e extrair URLs dos produtos
async function scrapeMainPage(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const productLinks = [];
        $('a[href*="/p/"]').each((i, element) => {
            const href = $(element).attr('href');
            if (href && !href.startsWith('http')) {
                const fullUrl = `https://www.netshoes.com.br${href}`;
                productLinks.push(fullUrl);
            } else if (href) {
                productLinks.push(href);
            }
        });

        console.log('URLs dos produtos:', productLinks);

        for (const link of productLinks) {
            await scrapeProduct(link);
        }
    } catch (error) {
        console.error('Erro ao fazer o scraping da página principal:', error);
    }
}

// Interface de comando para ler a URL do usuário
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askForProductUrl() {
    rl.question('Digite a URL da página de produto ou "main" para a página principal: ', (inputUrl) => {
        const url = inputUrl.trim(); // Remove espaços extras
        if (url.startsWith('http://') || url.startsWith('https://')) {
            console.log(`URL fornecida: ${url}`);
            scrapeProduct(url).then(() => rl.close());
        } else if (url.toLowerCase() === 'main') {
            rl.question('Digite a URL da página principal: ', (mainPageUrl) => {
                const url = mainPageUrl.trim(); // Remove espaços extras
                if (url.startsWith('http://') || url.startsWith('https://')) {
                    console.log(`URL fornecida: ${url}`);
                    scrapeMainPage(url).then(() => rl.close());
                } else {
                    console.log('A URL deve começar com "http://" ou "https://".');
                    rl.close();
                }
            });
        } else {
            console.log('URL inválida. Certifique-se de que começa com "http://" ou "https://".');
            rl.close();
        }
    });
}

askForProductUrl();
