import { GraphQLServer } from 'graphql-yoga';

//Type definitions (schema)
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
    }
`

//Resolvers
const resolvers = {
    Query: {
        id() {
            return "abc123";
        },
        name() {
            return "Jeanette";
        },
        age() {
            return 27;
        },
        employed() {
            return false;
        },
        gpa() {
            return;
        },
    }
}

const server = new GraphQLServer ({
    typeDefs, // 'typeDefs: typeDefs' but since they are name the same it's shorten to 'typeDefs'
    resolvers // similar to typeDefs
})

server.start(() => {
    console.log("The server is up! http://localhost:4000")
})