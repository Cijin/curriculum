const { gql } = require('apollo-server-express');
const fetch = require('node-fetch');
let allPokemons = [];
let pokeCache = {};
let userCache = {};
let lessonsCache = {};

fetch('https://pokeapi.co/api/v2/pokemon/?limit=1000')
  .then((res) => res.json())
  .then((data) => {
    allPokemons = data.results;
  });

const allLessons = [
  { title: 'Js0' },
  { title: 'Js1' },
  { title: 'Js2' },
  { title: 'Js3' },
  { title: 'Js4' },
  { title: 'Js5' },
];

const typeDefs = gql`
  type Lesson {
    title: String
    rating: Int
  }

  type Pokemon {
    name: String
    image: String
  }

  type User {
    name: String
    image: String
    lessons: [Lesson]
  }

  type Query {
    lessons: [Lesson]
    search(str: String!): [Pokemon]
    getPokemon(str: String!): Pokemon
    login(pokemon: String!): User
    user: User
  }

  type Mutation {
    enroll(title: String!): User
    unenroll(title: String!): User
    setRating(title: String!, rating: Int!): User
  }
`;

const resolvers = {
  Query: {
    lessons: () => allLessons,

    getPokemon: (_, { str }) => {
      const pokemon = pokeCache[str];
      if (pokemon) {
        return pokemon;
      }
      return fetch(`https://pokeapi.co/api/v2/pokemon/${str}`)
        .then((res) => res.json())
        .then((data) => {
          const result = {
            name: data.name,
            image: data.sprites.front_default,
          };
          pokeCache[str] = {};
          pokeCache[str] = result;
          return result;
        });
    },

    search: (_, { str }) => {
      return allPokemons.filter((pokemon) => {
        return pokemon.name.includes(str);
      });
    },

    login: (_, { pokemon }, { req }) => {
      req.session.user = pokemon;
      if (!userCache[pokemon]) {
        userCache[pokemon] = {};
        userCache[pokemon].name = pokeCache[pokemon].name;
        userCache[pokemon].image = pokeCache[pokemon].image;
        userCache[pokemon].lessons = [];
      }
      return userCache[pokemon];
    },

    user: (_, args, { req }) => {
      const pokemon = req.session.user;
      if (!userCache[pokemon]) return;

      return userCache[pokemon];
    },
  },

  Mutation: {
    enroll: (_, { title }, { req }) => {
      const pokemon = req.session.user;
      if (!pokemon && !userCache[pokemon]) return [];

      const lessons = lessonsCache[pokemon] || {};
      lessons[title] = 0;
      lessonsCache[pokemon] = lessons;
      userCache[pokemon].lessons = Object.entries(lessons).map(
        ([key, value]) => {
          return {
            title: key,
            rating: value,
          };
        }
      );
      return userCache[pokemon];
    },

    unenroll: (_, { title }, { req }) => {
      const pokemon = req.session.user;
      if (!pokemon && !userCache[pokemon]) return [];

      const lessons = lessonsCache[pokemon];
      delete lessons[title];
      userCache[pokemon].lessons = Object.keys(lessons).map((value) => {
        return {
          title: value,
        };
      });
      return userCache[pokemon];
    },

    setRating: (_, { title, rating }, { req }) => {
      const pokemon = req.session.user;
      if (!pokemon && !userCache[pokemon]) return [];

      const lessons = lessonsCache[pokemon];
      lessons[title] = rating;
      lessonsCache[pokemon] = lessons;

      userCache[pokemon].lessons = Object.entries(lessons).map(
        ([key, value]) => {
          return {
            title: key,
            rating: value,
          };
        }
      );
      return userCache[pokemon];
    },
  },
};

module.exports = { typeDefs, resolvers };
