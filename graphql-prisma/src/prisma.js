import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})

const createPostForUser = async (authorId, data) => {
    await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    })

    const user = await prisma.query.user({
        where: {
            id: authorId
        }
    }, '{ id name email posts{ id title published } }')

    return user;
}

const updatePostForUser = async (postId, data) => {
    // await prisma.mutation.updatePost({
    //     where: { id: "cjxnv6w1s01l208060cjr4ojj" } ,
    //     data: { body: "This is now complete.", published: true }
    //  }, '{ id }')
}

 
// createPostForUser('cjxnslh2g00za0806nhapyi8u', 
// { title: "Hello World", body: "Completed", published: true})
// .then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// })


prisma.mutation.updatePost({
   where: { id: "cjxnv6w1s01l208060cjr4ojj" } ,
   data: { body: "This is now complete.", published: true }
}, '{ id }').then(() => {
    return prisma.query.posts(null, '{ id, title, body, published}')
}).then((data) => {
    console.log(JSON.stringify(data, undefined, 2))
})