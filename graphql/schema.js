const resolver = require('./resolvers')
const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt
} = require("graphql");



const Like = new GraphQLObjectType({
    name: "Like",
    fields: {
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        createdAt: { type: GraphQLString }
    }
})
const Comment = new GraphQLObjectType({
    name: "Comment",
    fields: {
        id: { type: GraphQLID },
        body: { type: GraphQLString },
        username: { type: GraphQLString },
        createdAt: { type: GraphQLString }
    }
})

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: {
        id: { type: GraphQLID },
        body: { type: GraphQLString },
        username: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        comments: { type: GraphQLList(Comment) },
        likes: { type: GraphQLList(Like) },
        likeCount: { type: GraphQLInt },
        commentCount: { type: GraphQLInt }
    }
});

const RegisterInputType = new GraphQLObjectType({
    name: "Register",
    fields: {
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        token: { type: GraphQLString }
    }
})

const LoginType = new GraphQLObjectType({
    name: "Login",
    fields: {
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        token: { type: GraphQLString }
    }
})


module.exports.schema=new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            posts: {
                type: GraphQLList(PostType),
                resolve: (root, args, context, info) => {
                    return resolver.Query.getPosts()
                }
            },
            post: {
                type: PostType,
                args: {
                    id: { type: GraphQLNonNull(GraphQLID) }
                },
                resolve: (root, args, context, info) => {
                    return resolver.Query.getPost(args)//PostModel.findById(args.id).exec();
                    //post.commentCount=resolver.Post.commentCount(post)
                    //post.likeCount=resolver.Post.likeCount(post)
                    //return post;
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
            register: {
                type: RegisterInputType,
                args: {
                    username: { type: GraphQLNonNull(GraphQLString) },
                    password: { type: GraphQLNonNull(GraphQLString) },
                    confirmPassword: { type: GraphQLNonNull(GraphQLString) },
                    email: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: (root, args, context, info) => {
                    return resolver.Mutation.register(args);
                }
            },
            login: {
                type: LoginType,
                args: {
                    username: { type: GraphQLNonNull(GraphQLString) },
                    password: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: (root, args, context, info) => {
                    return resolver.Mutation.login(args);
                }
            },
            createPost: {
                type: PostType,
                args: {
                    body: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: (root, args, context, info) => {
                    return resolver.Mutation.createPost(args, context);
                }
            },
            deletePost: {
                type: GraphQLString,
                args: {
                    id: { type: GraphQLNonNull(GraphQLID) }
                },
                resolve: (root, args, context, info) => {
                    return resolver.Mutation.deletePost(args, context);                    
                }
            },
            creatComment: {
                type: PostType,
                args: {
                        postId: {type: GraphQLNonNull(GraphQLID),
                        body: { type: GraphQLNonNull(GraphQLString) }
                    }
                },
                resolve: (root, args, context, info) => {
                    return resolver.Mutation.createComment(args,context)
                    //post.commentCount=resolver.Post.commentCount(post)
                    //return post;
                }

            },
            deleteComment:{
                type:PostType,
                args:{
                    postId: { type: GraphQLNonNull(GraphQLID) },
                    commentId: { type: GraphQLNonNull(GraphQLID) }
                },
                resolve: (root, args, context, info) => {
                    return resolver.Mutation.deleteComment(args, context);
                    //post.commentCount=resolver.Post.commentCount(post)
                    //return post;
                }
            },
            likePost:{
                type:PostType,
                args:{
                    postId: { type: GraphQLNonNull(GraphQLID) },                    
                },
                resolve: (root, args, context, info) => {
                    return resolver.Mutation.likePost(args, context);
                    //post.likeCount=post.likes.length
                    //return post;
                }
            }
        }
    })

});

