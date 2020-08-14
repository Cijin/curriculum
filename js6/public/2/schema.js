const { gql } = require('apollo-server-express');
const fetch = require('node-fetch');
const userInfo = {};
const pokeCache = {};
let savedLessons = [];

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

const resolvePokemon = async (_, { str }) => {  
  if (pokeCache[str]) {    
    return {
      name: pokeCache[str].name,
      image: pokeCache[str].image,
    };
  }
  return await fetch(`https://pokeapi.co/api/v2/pokemon/${str}`)
    .then((response) => response.json())
    .then((data) => {
      pokeCache[str] = {};
      pokeCache[str].name = data.name;
      pokeCache[str].image = data.sprites.front_default;
      return {
        name: data.name,
        image: data.sprites.front_default
      }
    })
};

const resolvers = {
  Query: {
    lessons: async (_, args) => {      
      if (!savedLessons.length) {
        return await fetch("https://c0d3.com/api/lessons")
          .then((response) => response.json())
          .then((lessons) => {
            savedLessons = lessons;
            return lessons;
          });
      }
      return savedLessons
    },

    search: resolvePokemon,

    getPokemon: resolvePokemon,

    user: (_, args, { req }) => {
      if (req.session.pokemonName) {
        const pokemonName = req.session.pokemonName;        
        return {          
          name: pokeCache[pokemonName].name,
          image: pokeCache[pokemonName].image,
          lessons: userInfo[pokemonName].lessons || []
        };
      }
      return;
    },

    login: (_, { pokemon }, { req }) => {                          
      req.session.pokemonName = pokemon;     
      userInfo[pokemon] = {};
      userInfo[pokemon].lessons = []
      return {        
        name: pokeCache[pokemon].name,
        image: pokeCache[pokemon].image,
        lessons: savedLessons
      };
    },
  }, 

  Mutation: {
    enroll: (_, { title }, { req }) => {
      const pokemonName = req.session.pokemonName;
      if (!pokemonName) {
        return;
      }
      userInfo[pokemonName].lessons.forEach((lesson, idx) => {
        if (lesson.title === title) {
          userInfo[pokemonName].lessons.splice(idx, 1);
        }
      });
      return {
        user: pokemonName,
        name: pokeCache[pokemonName].name,
        image: pokeCache[pokemonName].image,
        lessons: userInfo[pokemonName].lessons
      };
    },

    unenroll: (_, { title }, { req }) => {
      const pokemonName = req.session.pokemonName;
      if (!pokemonName) {
        return;
      }
      userInfo[pokemonName].lessons.push({ title });
      return {
        user: pokemonName,
        name: pokeCache[pokemonName].name,
        image: pokeCache[pokemonName].image,
        lessons: userInfo[pokemonName].lessons
      };
    },
  }
};

module.exports = { typeDefs, resolvers }