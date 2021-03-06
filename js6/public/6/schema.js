const { gql } = require('apollo-server-express');
const fetch = require('node-fetch');
const { allPokemons } = require('../server');
let allLessons = {};
let userCache = {};
let userInfo = {};

const typeDefs = gql`
  type Lesson {
    title: String
  }
  type Mutation {
    enroll(title: String!): User
    unenroll(title: String!): User
    setRating(title: String, rating: Int): User
  }
  type Pokemon {
    name: String
    image: String
  }
  type Query {
    lessons: [Lesson]
    search(str: String!): [Pokemon]
    getPokemon(str: String!): Pokemon
    user: User
    login(pokemon: String!): User
  }
  type User {
    name: String
    image: String
    lessons: [Lesson]
  }
`;
const resolvers = {
  Query: {
    lessons: async () => {
      if (!allLessons) {
        allLessons = await fetch('https://c0d3.com/api/lessons')
          .then((response) => response.json())
          .then((lessons) => {
            return lessons;
          });
      }
      return allLessons;
    },
    getPokemon: (_, { str }) => {
      return allPokemons[str];
    },
    search: (_, { str }) => {
      return allPokemons.filter((pokemon) => {
        return pokemon.name.includes(str);
      });
    },
    login: (_, { pokemon }, { req }) => {
      if (!userCache[pokemon]) {
        req.session.user = pokemon;
        userCache[pokemon] = {};
        userCache[pokemon].name = allPokemons[pokemon].name;
        userCache[pokemon].image = allPokemons[pokemon].image;
        userCache[pokemon].lessons = {};
      }
      return userCache[pokemon];
    },
    user: (_, _, { req }) => {
      return req.session.user || {};
    },
  },
  Mutation: {
    enroll: (_, { title }, { req }) => {
      const pokemon = req.session.user;
      if (!pokemon) return;

      const lessons = userInfo[pokemon].lessons || {};
      lessons[title] = 0;
      userCache[pokemon].lessons = Object.entries(lessons).map(
        ([title, rating]) => {
          return { title, rating };
        }
      );
      userInfo[pokemon].lessons = lessons;
      return userCache[pokemon];
    },
    unenroll: (_, { title }, { req }) => {
      const pokemon = req.session.user;
      if (!pokemon) return;

      const lessons = userInfo[pokemon].lessons;
      delete lessons[title];
      userInfo[pokemon].lessons = lessons;
      userCache[pokemon].lessons = Object.entries.map(([title, rating]) => {
        return { title, rating };
      });
      return userCache[pokemon];
    },
    setRating: (_, { title, rating }, { req }) => {
      const pokemon = req.session.user;
      if (!pokemon) return;

      userInfo[pokemon].lessons[title] = rating;
      const lessons = userInfo[pokemon].lessons;

      userCache[pokemon].lessons = Object.entries.map(([title, rating]) => {
        return { title, rating };
      });
      return useCache[pokemon];
    },
  },
};
module.exports = { typeDefs, resolvers };
