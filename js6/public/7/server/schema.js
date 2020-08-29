const { gql } = require('apollo-server-express');
const fetch = require('node-fetch');
let allPokemons = [];
let pokeCache = {};

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
    user: User
    login(pokemon: String!): User
  }

  type Mutation {
    enroll(title: String!): User
    unenroll(title: String!): User
    setRating(rating: Int!): User
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
          pokeCache[str] = result;
          return result;
        });
    },

    search: (_, { str }) => {
      return allPokemons.filter((pokemon) => {
        return pokemon.name.includes(str);
      });
    },
  },
};

module.exports = { typeDefs, resolvers };
