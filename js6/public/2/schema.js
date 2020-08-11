const { gql } = require('apollo-server-express');
const fetch = require('node-fetch');
const loginInfo = {};

const typeDefs = gql`
  type Pokemon {
    name: String
    image: String
  }

  type BasicPokemon {
    name: String 
  }

  type Lesson {
    title: String
  }

  type User {
    name: String
    image: String
    lessons: [Lesson]
  }

  type Query {
    lessons: [Lesson]
    search(str: String!): [BasicPokemon]
    getPokemon(str: String!): Pokemon
    user: User
    login(pokemon: String!): User
  }

  type Mutation {
    enroll(title: String!): User
    unenroll(title: String!): User
  }
`;

const resolvePokemon = async (parent, { str }) => {
  return await fetch(`https://pokeapi.co/api/v2/pokemon/${str}`)
    .then((response) => response.json())
    .then((data) => {
      return {
        name: data.name,
        image: data.sprites.front_default
      }
    })
};

const resolvers = {
  Query: {
    lessons: async () => {
      const response = await fetch("https://c0d3.com/api/lessons");
      return response.json();
    },

    search: resolvePokemon,

    getPokemon: resolvePokemon,

    user: (parent, args, { req }) => {
      if (loginInfo[req.session.name]) {
        return loginInfo[name];
      }
      return;
    },

    login: (parent, { pokemon }, { req }) => {
      const name = pokemon.name;
      const image = pokemon.image;
      const lessons = lessons();
      req.session.name = name;
      return loginInfo[name] = { name, image, lessons };
    },
  }, 

  Mutation: {
    enroll: (parent, { title }, { req }) => {

    },

    unenroll: (parent, { title }, { req }) => {

    },
  }
};

module.exports = { typeDefs, resolvers }