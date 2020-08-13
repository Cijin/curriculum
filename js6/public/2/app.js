const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

app.use(
  session({
    name: "oreo",
    secret: "cookie&cream",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 100000,
    }
}));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => { 
    return { req };
  },
});

server.applyMiddleware({ app });

app.get('/', (req, res) => {
  return res.sendFile(path.resolve(__dirname, 'index.html'));
});


app.listen({ port: 4001 }, () => {
  console.log(`🚀 Server ready on Port: 4001`);  
});