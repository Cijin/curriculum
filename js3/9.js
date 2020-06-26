const fetch = require('node-fetch');
const fs = require('fs');

fetch('https://pokeapi.co/api/v2/pokemon/')
  .then((response) => {
    return response.json();
  }).then((data) => {
    const fetchPromises = data.results.map((pokemon) => {
      return fetch(pokemon.url).then((pokeRes) => {
        return pokeRes.json();
      });
    })
    return Promise.all(fetchPromises);
  }).then((dataList) => {
    return dataList.reduce((html, pokemon) => {
      return html = `${html}<h1>${pokemon.name}</h1><img src=${pokemon.sprites.front_default} />`;
    }, '')
  }).then((html) => {
    fs.writeFile('9.html', html, () => {});
  });