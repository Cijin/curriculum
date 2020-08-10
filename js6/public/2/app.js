const express = require('express');
const app = express();
const session = require('express-session');
const fetch = require('node-fetch');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });

app.listen({ port: 4001 }, () => {
  console.log(`🚀 Server ready at http://localhost:4001/graphql}`);
});