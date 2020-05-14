const { ApolloServer, gql } = require('apollo-server')
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

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ event, context }) => ({
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    }),
  })

  mongoose.connect(MONGO,{useNewUrlParser:true})
    .then(()=>{
        console.log("mongodb connected!!!")
        //return server.listen({port:8000})
    }).then(res=>{
        console.log(`server running at ${res.url}`)
    })


exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
})




















// const {ApolloServer} =require('apollo-server');
// const typeDefs=require('./graphql/typeDefs')
// const resolvers=require('./graphql/resolvers')
// const mongoose=require('mongoose')

// const MONGO='mongodb+srv://Ankit:zYZOl7WEfY5imvw2@cluster0-xthjj.mongodb.net/merng?retryWrites=true&w=majority';




// const server=new ApolloServer({
//     typeDefs,
//     resolvers,
//     context:({req})=>({req})
// });

