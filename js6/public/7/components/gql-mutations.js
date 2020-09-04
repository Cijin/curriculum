import gql from 'graphql-tag';
let Mutations = {};

const ENROLL = gql`
  mutation enroll($name: String!) {
    enroll(title: $name) {
      name
    }
  }
`;

const UNENROLL = gql`
  mutation unenroll($name: String!) {
    unenroll(title: $name) {
      name
    }
  }
`;

const SET_RATING = gql`
  mutation setRating($title: String!, $rating: Int!) {
    setRating(title: $title, rating: $rating) {
      name
    }
  }
`;

Mutations = {
  ENROLL,
  UNENROLL,
  SET_RATING,
};

export default Mutations;
