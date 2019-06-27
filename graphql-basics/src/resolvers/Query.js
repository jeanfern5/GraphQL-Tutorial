const Query = {
    users(parent, args, { db }, info) {
        const query = args.query;

        if (!query){
            return db.users;
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(query.toLowerCase());
        });
    },
    posts(parent, args, { db }, info) {
        const query = args.query;

        if (!query){
            return db.posts;
        }

        return db.posts.filter((post) => {
            const isTitleMatch = post.title.toLowerCase().includes(query.toLowerCase());
            const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase());

            return isTitleMatch || isBodyMatch; 
        });
    },
    comments(parent, args, { db }, info) {
        return db.comments;
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
}

export default Query;