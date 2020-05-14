var resolvers=require('./');
//var userResolvers=require('./users.js');
const {posts, users}=resolvers

module.exports={
    Post:{
        likeCount:(parent)=> parent.likes.length,        
        commentCount:(parent)=>parent.comments.length        
    },
    Query:{
        ...posts.Query
    },
    Mutation:{
        ...users.Mutation,
        ...posts.Mutation
    }
}