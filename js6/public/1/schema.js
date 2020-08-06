export const typeDefs = gql(`
  type Challenge {
    id: Int
    lessonId: Int
    title: String
  }  

  type lessons {
    id: Int
    title: String
    challenges: [Challenge]
  }
`),