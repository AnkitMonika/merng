const postsResolvers=require('../../graphql/resolvers/posts');
const userResolvers=require('./users.js');


module.exports={
    Post:{
        likeCount:(parent)=> parent.likes.length,        
        commentCount:(parent)=>parent.comments.length        
    },
    Query:{
        ...postsResolvers.Query
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...postsResolvers.Mutation
    }
}