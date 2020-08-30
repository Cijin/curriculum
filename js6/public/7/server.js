const express = require('express');
const app = express();
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./server/schema');
const path = require('path');
const session = require('express-session');
const fetch = require('node-fetch');
const morgan = require('morgan');

app.use(morgan('dev'));

app.use(
  session({
    secret: 'cookies&cream',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, maxAge: 100000 },
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.get('/', (req, res) => {
  return res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/dist/main.js', (req, res) => {
  return res.sendFile(path.resolve(__dirname, 'dist/main.js'));
});

app.listen({ port: 8123 }, () => {
  console.log(`🚀 Server ready at http://localhost:8123${server.graphqlPath}`);
});
