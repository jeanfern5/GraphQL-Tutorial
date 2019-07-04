import uuidv4 from 'uuid/v4';


const Mutation = {
    createUser(parent, { data }, { db: {users} }, info) {
        const { email } = data;
        const emailTaken = users.some((user) => user.email === email);

        if (emailTaken) {
            throw new Error(`Email already taken.`);
        }

        const user = {
            id: uuidv4(),
            ...data
        }

        users.push(user);

        return user;
    },
    deleteUser(parent, { id }, { db: {users, posts, comments} }, info) {
        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            throw new Error(`User not found`);
        }

        const deletedUser = users.splice(userIndex, 1);

        posts = posts.filter((post) => {
            const match = post.author === id;

            if (match) {
                comments = comments.filter((comment) => comment.post !== post.id)
            }

            return !match;
        })

        comments = comments.filter((comment) => comment.author !== id)

        return deletedUser[0];
    },
    updateUser(parent, { id, data }, { db : {users} }, info) {
        const { email, name, age } = data;
        const user = users.find((user) => user.id === id);

        if (!user) {
            throw new Error('User not found');
        }

        if (typeof email === 'string') {
            const emailTaken = users.some((user) => user.email === email);

            if (emailTaken) {
                throw new Error('Email already taken')
            }

            user.email = email
        }

        if (typeof name === 'string') {
            user.name = name
        }

        if (typeof age !== 'undefined') {

            if (age === 0){
                user.age = "null"
            }

            user.age = age
        }

        return user;
    },
    createPost(parent, { data }, { db: {users, posts}, pubsub }, info) {
        const { author } = data;
        const userExists = users.some((user) => user.id === author);

        if (!userExists) {
            throw new Error('User not found');
        }

        const post = {
            id: uuidv4(),
            ...data
        }

        posts.push(post);

        if (data.published) {
            pubsub.publish(`post`, { 
                post: {
                    mutation: `CREATED`,
                    data: post
                }
            });
        }
        
        return post;
    },
    deletePost(parent, { id }, { db: {posts, comments}, pubsub }, info) {
        const postIndex = posts.findIndex((post) => post.id === id);

        if (postIndex === -1) {
            throw new Error(`Post not found`);
        }

        const [deletedPost] = posts.splice(postIndex, 1);

        comments = comments.filter((comment) => comment.post !== id);

        if (deletedPost.published){
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost
                }
            })
        }

        return deletedPost;

    },
    updatePost(parent, { id, data }, { db: {posts}, pubsub }, info){
        const { title, body, published } = data;
        const post = posts.find((post) => post.id === id);
        const originalPost = { ...post };

        if (!post) {
            throw new Error('Post not found');
        }

        if (typeof title === 'string') {
            post.title = title
        }

        if (typeof body === 'string') {
            post.body = body
        }

        if (typeof published === 'boolean') {
            post.published = published

            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post;
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