import gql from 'graphql-tag';
let Queries = {};

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

Queries = {
  GET_POKEMON,
  SEARCH_POKEMON,
};

export default Queries;
