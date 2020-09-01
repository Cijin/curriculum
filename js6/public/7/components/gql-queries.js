import { gql } from '@apollo/client';
const queries = {};

queries.GET_POKEMON = gql`
  query getPokemon($name: String) {
    getPokemon(str: $name) {
      name
      image
    }
  }
`;

queries.SEARCH_POKEMON = gql`
  query search($name: String) {
    search(str: $name) {
      name
      image
    }
  }
`;

export default queries;
