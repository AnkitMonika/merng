const express = require('express');
const {ApolloServer} =require('apollo-server');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const mongoose=require('mongoose')

const MONGO='mongodb+srv://Ankit:zYZOl7WEfY5imvw2@cluster0-xthjj.mongodb.net/merng?retryWrites=true&w=majority';


/* Construct a schema, using GraphQL schema language */
const typeDefs = gql`
  type Query { hello: String }
`

/* Provide resolver functions for your schema fields */
const resolvers = {
  Query: {
    hello: () => 'Hello from Apollo!!',
  },
}

const server=new ApolloServer({
    typeDefs,
    resolvers,
    context:({req})=>({req})
});

mongoose.connect(MONGO,{useNewUrlParser:true})
.then(()=>{
    console.log("mongodb connected!!!")
    //return server.listen({port:8000})
}).then(res=>{
    console.log(`server running at ${res}`)
})

// const app = express();
// app.use('/graphql', graphqlHTTP({
//   schema,
//   rootValue: resolvers
// }));

server.listen(4000);
console.log(`Server ready at http://localhost:4000/graphql`);