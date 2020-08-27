const path = require('path');
const session = require('express-session');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const app = express();
const { typeDefs, resolvers } = require('./server/schema');
const fetch = require('node-fetch');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(
  session({
    name: 'oreo',
    secret: 'cookie&cream',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 10000,
    },
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

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
});

let allPokemons = [];
fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    app.listen({ port: 8123 }, () => {
      console.log(`🚀 Server ready on Port: 8123`);
    });
  });

module.exports = { allPokemons };
