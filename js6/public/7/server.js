const express = require('express');
const app = express();
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./server/schema');
const path = require('path');
const session = require('express-session');
const fetch = require('node-fetch');
const morgan = require('morgan');

let allPokemons = {};
const cachedPokemons = async () => {
  allPokemons = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1000')
    .then((res) => res.json())
    .then((data) => {
      const temp = {};
      data.results.forEach((pokemon) => {
        temp[pokemon.name] = true;
      });
      return temp;
    });
};

const loadData = async () => await cachePokemons();

app.use(morgan('dev'));

app.use(
  session({
    secret: 'cookies&cream',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 100000 },
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { req };
  },
});

server.applyMiddleware({ app });

app.get('/:classroom?', (req, res) => {
  return res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/dist/main.js', (req, res) => {
  return res.sendFile(path.resolve(__dirname, 'dist/main.js'));
});

loadData().then(() => {
  app.listen({ port: 8123 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:8123${server.graphqlPath}`
    );
  });
});

module.exports = {
  cachedPokemons,
};
