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
  GET_POKEMON,
  GET_USER,
};

export default Queries;
