const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose=require('mongoose')
const Post =require('./models/Post')
var config = require('./global')
const schema=require('./graphql2/schema')
const resolvers=require('./graphql2/resolvers2')
const {MONGO}=config

//const MONGO='mongodb+srv://Ankit:zYZOl7WEfY5imvw2@cluster0-xthjj.mongodb.net/merng?retryWrites=true&w=majority';


// Provide resolver functions for your schema fields
// const resolvers = {
//   async getPosts(){
//     try{
//         const posts=await Post.find().sort({createdAt:-1});
//         return posts;
//     }catch(err){
//         throw new Error(err);
//     }
//   }
// };

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