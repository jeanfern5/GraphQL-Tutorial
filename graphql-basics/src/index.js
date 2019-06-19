import { GraphQLServer } from 'graphql-yoga';

//Demo user data
const users = [
    {
        id: "1",
        name: "Jeanette",
        email: "jeanette@example.com"
    },
    {
        id : "2",
        name: "Matt",
        email: "matt@example.com"
    },
    {
        id: "3",
        name: "Taco",
        email: "taco@example.com",
        age: 100
    }
]

//Demo post data
const posts = [
    {
        id: "a1",
        title: "Hello World",
        body: "Hello World",
        published: true
    },
    {
        id: "b2",
        title: "GraphQL",
        body: "This is how you graphql....",
        published: false
    },
    {
        id: "c3",
        title: "The Final Post",
        body: "It was never completed....",
        published: false
    }
]

//Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
        post: Post!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post{
       id: ID!
       title: String!
       body: String!
       published: Boolean! 
    }
`

//Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            const query = args.query;

            if (!query){
                return users;
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(query.toLowerCase());
            });
        },
        me() {
            return {
                id: "1234098",
                name: "Mike",
                email: "Mike@example.com"
            };
        },
        posts(parent, args, ctx, info) {
            const query = args.query;

            if (!query){
                return posts;
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase());

                return isTitleMatch || isBodyMatch; 
            });
        },
        post() {
            return {
                id: "abc1234",
                title: "GraphQL",
                body: "This is how you graphql....",
                published: false
            };
        },
    }
}

const server = new GraphQLServer ({
    typeDefs, // 'typeDefs: typeDefs' but since they are name the same it's shorten to 'typeDefs'
    resolvers // similar to typeDefs
})

server.start(() => {
    console.log("\n<---------- The server is up! http://localhost:4000 ---------->\n");
})