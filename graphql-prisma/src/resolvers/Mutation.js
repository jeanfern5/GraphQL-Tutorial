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
            } }, info);

        return createdPost;
    },
    deletePost(parent, { id }, { prisma }, info) {
        return prisma.mutation.deletePost({ where: { id } }, info)
    },
    updatePost(parent, { id, data }, { prisma }, info){
        return prisma.mutation.updatePost({ where: { id }, data: data }, info)
    }, 
    createComment(parent, { data }, { db: {users, posts, comments}, pubsub}, info) {
        const { author, post } = data;
        const userExists = users.some((user) => user.id === author);
        const postExists = posts.some((postItem) => (postItem.id === post) && postItem.published);

        if (!userExists) {
            throw new Error('User not found');
        } else if (!postExists) {
            throw new Error('Post not found');
        }

        const comment = {
            id: uuidv4(),
            ...data
        }

        comments.push(comment);
        pubsub.publish(`comment ${post}`, { 
            comment : {
                mutation: 'CREATED',
                data: comment
            }
        })

        return comment;
    },
    deleteComment(parent, { id }, { db: {comments}, pubsub }, info) {
        const commentIndex = comments.findIndex((comment) => comment.id === id);

        if (commentIndex === -1){
            throw new Error(`Comment not found`)
        }

        const [deletedComment] = comments.splice(commentIndex, 1);
        pubsub.publish(`comment ${deletedComment.post}`, { 
            comment : {
                mutation: 'DELETED',
                data: deletedComment
            }
        })

        return deletedComment;
    },
    updateComment(parent, { id, data }, { db: {comments}, pubsub }, info){
        const { text } = data;
        const comment = comments.find((comment) => comment.id === id);

        if (!comment) {
            throw new Error('Comment not found');
        }

        if (typeof text === 'string') {
            comment.text = text
        }
        pubsub.publish(`comment ${comment.post}`, { 
            comment : {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment; 
    }
}

export default Mutation;