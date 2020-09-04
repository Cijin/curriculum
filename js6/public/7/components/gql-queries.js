import gql from 'graphql-tag';
let Queries = {};

const LOGIN = gql`
  query login($name: String!) {
    login(pokemon: $name) {
      name
    }
  }
`;

const GET_POKEMON = gql`
  query getPokemon($name: String!) {
    getPokemon(str: $name) {
      name
      image
    }
  }
`;

const SEARCH_POKEMON = gql`
  query search($name: String!) {
    search(str: $name) {
      name
    }
  }
`;

const GET_USER = gql`
  {
    user {
      name
      image
      lessons {
        title
        rating
      }
    }
    lessons {
      title
    }
  }
`;

Queries = {
  LOGIN,
  GET_POKEMON,
  SEARCH_POKEMON,
  GET_USER,
};

export default Queries;
