var resolvers=require('./');
//var userResolvers=require('./users.js');


module.exports={
    Post:{
        likeCount:(parent)=> parent.likes.length,        
        commentCount:(parent)=>parent.comments.length        
    },
    Query:{
        ...resolvers.postsResolvers.Query
    },
    Mutation:{
        ...resolvers.userResolvers.Mutation,
        ...resolvers.postsResolvers.Mutation
    }
}