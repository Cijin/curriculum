const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => { req },
});

server.applyMiddleware({ app });

app.use(session({
  name: "oreo",
  secret: "cookie&cream",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 10000,
  }
}));

app.get('/', (req, res) => {
  return res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen({ port: 4001 }, () => {
  console.log(`🚀 Server ready on Port: 4001`);
});