const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose=require('mongoose')
const Post =require('./models/Post')
const {MONGO} = require('./config')
//const MONGO='mongodb+srv://Ankit:zYZOl7WEfY5imvw2@cluster0-xthjj.mongodb.net/merng?retryWrites=true&w=majority';
// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
      type Post{
        id:ID!
        body:String!
        createdAt:String!
        username:String!
        comments:[Comment]!
        likes:[Like]!
        likeCount:Int!
        commentCount:Int!
      }
      type Comment{
        id:ID!
        createdAt:String!
        username:String!
        body:String!
      }
      type Like{
        id:ID!
        createdAt:String!
        username:String!
      }
      type User{
        id:ID!
        email:String!
        token:String!
        username:String!
        createdAt:String!
      }
      input RegisterInput{
        username:String!
        password:String!
        confirmPassword:String!
        email:String!
      }
      type Query{
        getPosts:[Post]
        getPost(postId:ID!):Post
    }
    type Mutation{
        register(registerInput:RegisterInput):User!
        login(username:String!,password:String!):User!
        createPost(body:String!):Post
        deletePost(postId:ID!):String!
        createComment(postId:String!,body:String!):Post!
        deleteComment(postId:ID!,commentId:ID!):Post!
        likePost(postId:String!):Post!        
    }
`);

// Provide resolver functions for your schema fields
const resolvers = {
  async getPosts(){
    try{
        const posts=await Post.find().sort({createdAt:-1});
        return posts;
    }catch(err){
        throw new Error(err);
    }
  }
};

mongoose.connect(MONGO,{useNewUrlParser:true})
.then(()=>{
    console.log("mongodb connected!!!")
    //return server.listen({port:8000})
}).then(res=>{
    console.log(`server running at ${res}`)
})

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers
}));
app.listen(4000);

console.log(`Server ready at http://localhost:4000/graphql`);