const express = require('express');
const app = express();
const session = require('express-session');
const fetch = require('node-fetch');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ session: req.session }),
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

app.listen({ port: 4001 }, () => {
  console.log(`🚀 Server ready at http://localhost:4001/graphql}`);
});