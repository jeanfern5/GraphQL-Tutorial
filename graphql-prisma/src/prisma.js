import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
});

export default prisma;

// const createPostForUser = async (authorId, data) => {
//     await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     })

//     const user = await prisma.query.user({
//         where: {
//             id: authorId
//         }
//     }, '{ id name email posts{ id title published } }')

//     return user;
// }

// const updatePostForUser = async (postId, data) => {
//     const postExists = await prisma.exists.Post({ id: postId })

//     if (!postExists) {
//         throw new Error('Post not found')
//     }

//     const post = await prisma.mutation.updatePost({
//         where: {
//             id: postId
//         },
//         data
//     }, '{ author { id name email posts { id title published } } }')
    
//     return post.author
// }
 
// // createPostForUser('cjxnslh2g00za0806nhapyi8u', 
// // { title: "Hello World", body: "Completed", published: true})
// // .then((user) => {
// //     console.log(JSON.stringify(user, undefined, 2))
// // })


// // updatePostForUser("power", { published: true }).then((user) => {
// //     console.log(JSON.stringify(user, undefined, 2))
// // }).catch((error) => {
// //     console.log(error.message)
// // })
