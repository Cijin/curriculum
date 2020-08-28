const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const app = express();
const fetch = require('node-fetch');

const typeDefs = gql`
  type Lesson {
    title: String
  }
  
  type Pokemon {
    name: String
    image: String
  }

  type BasicPokemon {
    name: String
  }

  type Query {
    lessons: [Lesson]
    search(str: String!): BasicPokemon
    getPokemon(str: String!): Pokemon
  }
`;

const resolvePokemon = async (parent, {str}) => {
 return await fetch(`https://pokeapi.co/api/v2/pokemon/${str}`)
                  .then((response) => response.json())
                  .then((data) => { 
                  return {
                    name: data.name,
                    image: data.sprites.front_default
                  }
                });  
}

const resolvers = {
  Query: {
    lessons: async () => {
      const response = await fetch("https://c0d3.com/api/lessons");
      return response.json();
    },

    getPokemon: resolvePokemon,

    search: resolvePokemon,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });

app.listen({ port: 4001 }, () => {
  console.log(`🚀 Server ready at http://localhost:4001/graphql}`);
});
