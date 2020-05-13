const {ApolloServer} =require('apollo-server');
const typeDefs=require('./graphql/typeDefs')
const resolvers=require('./graphql/resolvers')
const mongoose=require('mongoose')
const {MONGO}=require('./config.js')


const server=new ApolloServer({
    typeDefs,
    resolvers,
    context:({req})=>({req})
});

mongoose.connect(MONGO,{useNewUrlParser:true})
    .then(()=>{
        console.log("mongodb connected!!!")
        return server.listen({port:5000})
    }).then(res=>{
        console.log(`server running at ${res.url}`)
    })