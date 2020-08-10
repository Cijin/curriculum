const { gql } = require('apollo-server-express');

export default typeDefs = gql`
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

const resolvePokemon = async (parent, {str}) => {
  return await fetch(`https://pokeapi.co/api/v2/pokemon/${str}`)
    .then((response) => response.json())
    .then((data) => {
      return {
        name: data.name,
        image: data.sprites.front_default
      }
    })
};

export default resolvers = {
  Query: {
    lessons: async () => {
      const response = await fetch("https://c0d3.com/api/lessons");
      return response.json();
    },

    search: resolvePokemon,

    getPokemon: resolvePokemon,
  }
};