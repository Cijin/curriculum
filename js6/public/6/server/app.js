const path = require("path");
const session = require("express-session");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const app = express();
const { typeDefs, resolvers } = require("./schema");

app.use(
  session({
    name: "oreo",
    secret: "cookie&cream",
    resave: false,
    saveUnintialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 10000
    }
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { req };
  }
});

 server.applyMiddleware({ app });

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./index.html"));
});
