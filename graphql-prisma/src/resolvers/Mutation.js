import uuidv4 from 'uuid/v4';


const Mutation = {
    async createUser(parent, { data }, { prisma }, info) {
        const emailTaken = await prisma.exists.User({ email: data.email });

         if (emailTaken) {
            throw new Error(`Email already taken.`);
        }

        const user = await prisma.mutation.createUser({ data }, info)
 
        return user;
    },
    async deleteUser(parent, { id }, { prisma }, info) {
        const userExists = await prisma.exists.User({ id })

        if (!userExists) {
            throw new Error(`User not found`);
        }

        const deletedUser = await prisma.mutation.deleteUser({ where: { id } }, info);
        
        return deletedUser;

    },
    async updateUser(parent, { id, data }, { prisma }, info) {
        const userExists = await prisma.exists.User({ id })

        if (!userExists) {
            throw new Error(`User not found`);
        }

       const udpatedUser = await prisma.mutation.updateUser({ where: { id }, data: data }, info);

       return udpatedUser;
    },
    async createPost(parent, { data }, { prisma }, info) {

        const createdPost = await prisma.mutation.createPost({ 
            data: { title: data.title, body: data.body, published: data.published, 
                    author: { 
                        connect: { id: data.author } 
                    } 
            } 
        }, info);

        return createdPost;
    },
    deletePost(parent, { id }, { prisma }, info) {
        return prisma.mutation.deletePost({ where: { id } }, info)
    },
    updatePost(parent, { id, data }, { prisma }, info){
        return prisma.mutation.updatePost({ where: { id }, data: data }, info)
    }, 
    createComment(parent, { data }, { prisma }, info) {
        return prisma.mutation.createComment({
            data: { text: data.text,
                    author: {
                        connect: { id: data.author}
                    },
                    post: {
                        connect: { id: data.post }
                    }
            }
        }, info);
    },
    deleteComment(parent, { id }, { prisma }, info) {
        return prisma.mutation.deleteComment({ where: { id } }, info);
    },
    updateComment(parent, { id, data }, { prisma }, info){
        return prisma.mutation.updateComment({ where: { id }, data }, info)
    }
}

export default Mutation;