const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const app = express();
const fetch = require('node-fetch');

const typeDefs = gql`
  type Lesson {
    title: String
  }

  type Query {
    lessons: [Lesson]
    getPokemon(id: Int!): Pokemon
    search(str: String!): Pokemon
  }

  type Pokemon {
    name: String
    image: String
  }
`;

const resolvers = {
  Query: {
    lessons: async () => {
      const response = await fetch("https://c0d3.com/api/lessons");
      return response.json();
    },

    getPokemon: async (parent, { id }) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return response.json();
    },

    search: async (parent, {str}) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${str}`);
      return response.json();
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });

app.listen({ port: 4001 }, () => {
  console.log(`🚀 Server ready at http://localhost:4001${server.graphqlPath}`);
});
