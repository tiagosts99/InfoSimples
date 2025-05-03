const cheerio = require('cheerio');
const request = require('request');


const fs = require('fs');


//URL do Site
const url = 'https://infosimples.com/vagas/desafio/commercia/product.html';

const respostaFinal = {};



//Faz o request e manipula o corpo de resposta
request(url, function (error, response, body) {
    const parsedHtml = cheerio.load(body);
    if (error) {
        console.log('Erro ao fazer o request:', error);
        return;
    }

    respostaFinal['title'] = parsedHtml('h2#product_title').text();
    respostaFinal['subtitle'] = parsedHtml('div.brand').text();
    respostaFinal['categories'] = parsedHtml('nav.current-category').text().split('>').map(item => item.trim());
    respostaFinal['description'] = parsedHtml('div.proddet p').text();
    respostaFinal['skus'] = parsedHtml('div.card-container').toArray().map(item => {
        let $item = parsedHtml(item);
        return {
            'nome': $item.find('div.prod-nome').text().trim(),
            'preco': $item.find('div.prod-pnow').text() || null,
            'precoAntigo': $item.find('div.prod-pold').text() || null,
            'disponivel': $item.find('div.card not-available').text(),
        };
    });
    respostaFinal['properties'] = parsedHtml('table:first').toArray().map(item => {
        let $item = parsedHtml(item);
        return {
            'Color': $item.find('td').eq(1).text().trim(),
            'Material': $item.find('td').eq(3).text().trim(),
            'Shape': $item.find('td').eq(5).text().trim(),
            'Size': $item.find('td').eq(7).text().trim(),
            'Weight': $item.find('td').eq(9).text().trim(),
            'Radioactive Level': $item.find('td').eq(11).text().trim(),
            'Warranty': $item.find('td').eq(13).text().trim(),
        };
        
    });
    respostaFinal[''] = parsedHtml('table:last').toArray().map(item => {
        let $item = parsedHtml(item);
        return {
            'Notorius Value': $item.find('td').eq(1).text().trim(),
            'Origin': $item.find('td').eq(3).text().trim(),
            'Allergenics': $item.find('td').eq(5).text().trim(),
            'Recyclable?': $item.find('td').eq(7).text().trim(),
            'Harmful?': $item.find('td').eq(9).text().trim(),
            'Health benefits': $item.find('td').eq(11).text().trim(),
            'Storage temperature': $item.find('td').eq(13).text().trim(),
            'Expiration date': $item.find('td').eq(15).text().trim(),
            'Carbon footprint': $item.find('td').eq(17).text().trim(),
        };
        
    });

    respostaFinal['Reviews'] = parsedHtml('div.analisebox').toArray().map(item => {
        let $item = parsedHtml(item);
        return {
            'name': $item.find('span.analiseusername').text().trim(),
            'date': $item.find('span.analisedate').text().trim(),
            'stars': $item.find('span.analisestars').text().trim(),
            'review': $item.find('p').text().trim(),
        };
    });

    respostaFinal['reviews_average_score'] = parsedHtml('#comments h4').text().split(':')[1];
    respostaFinal['url'] = url;




    const jsonRespostaFinal = JSON.stringify(respostaFinal, null, 2);
    fs.writeFile('produto.json', jsonRespostaFinal, function (err) {
        if (err) {
            console.log(err);
        }else {
            console.log('Arquivo criado com sucesso!');
        }
    });
});