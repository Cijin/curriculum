import gql from 'graphql-tag';
const Queries = {};

Queries.GET_POKEMON = gql`
{
  query getPokemon($name: String) {
    getPokemon(str: $name) {
      name
      image
    }
  }
}
`;

Queries.SEARCH_POKEMON = gql`
{
  query search($name: String) {
    search(str: $name) {
      name
      image
    }
  }
}
`;

export default Queries;
