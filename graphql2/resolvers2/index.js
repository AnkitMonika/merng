var resolvers=require('./posts.js');
//var userResolvers=require('./users.js');
const {posts}=resolvers

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