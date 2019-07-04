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
        published: true,
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
        post: "a1"
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
        post: "b2"
    },
    {
        id: "w97",
        text: "I love the diagrams!",
        author: "3",
        post: "a1"
    },

]

const db = {
    users,
    posts,
    comments
}

export { db as default }