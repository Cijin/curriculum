const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');
const fetch = require('node-fetch');

const loadData = async () => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        lessons {title}
      }`
    })
  };
  await fetch('http://localhost:4001/graphql', fetchOptions);
};

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
  loadData().then(() => {
    console.log(`🚀 Server ready on Port: 4001`);
  })  
});