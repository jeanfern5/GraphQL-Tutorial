import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

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
        published: true,
        author: '3'
    },
    {
        id: "b2",
        title: "GraphQL",
        body: "This is how you graphql....",
        published: false,
        author: "1"
    },
    {
        id: "c3",
        title: "The Final Post",
        body: "It was never completed....",
        published: false,
        author: "2"
    },
    {
        id: "a2",
        title: "Hello GraphQL",
        body: "This is about GraphQL....",
        published: false,
        author: "1"
    },

]

//Demo comments data
const comments = [
    {
        id: "z100",
        text: "Awesomesauce!",
        author: "1",
        post: "c3"
    },
    {
        id: "y99",
        text: "Cool!",
        author: "1",
        post: "a1"
    },
    {
        id: "x98",
        text: "Could use more images.",
        author: "2",
        post: "a2"
    },
    {
        id: "w97",
        text: "I love the diagrams!",
        author: "3",
        post: "a1"
    },

]

//Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]! 
        me: User!
        post: Post!
    }

    type Mutation {
        createUser(data: inputUser!): User!
        createPost(data: inputPost!): Post!
        createComment(data: inputComment!): Comment!
    }

    input inputUser {
        name: String!
        email: String!
        age: Int
    }

    input inputPost {
        title: String!
        body: String!
        published: Boolean! 
        author: ID!
    }

    input inputComment {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
       id: ID!
       title: String!
       body: String!
       published: Boolean! 
       author: User!
       comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        comments(parent, args, ctx, info) {
            return comments;
        },
        me() {
            return {
                id: "1234098",
                name: "Mike",
                email: "Mike@example.com"
            };
        },
        post() {
            return {
                id: "abc1234",
                title: "GraphQL",
                body: "This is how you graphql....",
                published: false
            };
        },
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email);

            if (emailTaken) {
                throw new Error(`Email already taken.`);
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }


            users.push(user);

            return user;
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author);

            if (!userExists) {
                throw new Error('User not found');
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post);

            return post;
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author);
            const postExists = posts.some((post) => post.id === args.data.post && post.published);

            if (!userExists) {
                throw new Error('User not found');
            } else if (!postExists) {
                throw new Error('Post not found');
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment);

            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id === parent.author);
        },
        comments(parent, args, ctx, info) {
       
            return comments.filter((comment) => comment.post === parent.id);
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id === parent.author);
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => post.id === parent.post);
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => post.author === parent.id);
        },
        comments(parent, args, ctx, info) {
            return comments.filter((post) => post.author === parent.id);
        }
    },
}

const server = new GraphQLServer ({
    typeDefs, // 'typeDefs: typeDefs' but since they are name the same it's shorten to 'typeDefs'
    resolvers // similar to typeDefs
})

server.start(() => {
    console.log("\n<---------- The server is up! http://localhost:4000 ---------->\n");
})