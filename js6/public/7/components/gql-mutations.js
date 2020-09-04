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

Mutations = {
  ENROLL,
  UNENROLL,
};

export default Mutations;
