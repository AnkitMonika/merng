const Express = require("express");
const ExpressGraphQL = require("express-graphql");
const mongoose = require("mongoose");
const { MONGO } = require('./global')
const graphqlHTTP = require('express-graphql');
const {schema}=require('./graphql/schema')

var cors=require('cors')
var app = Express();

mongoose.connect(MONGO,{useNewUrlParser:true,useUnifiedTopology:true}).
then(()=>{
    console.log("monodb connected")
},err=>{Console.log(err)});


app.options('*', cors());

 app.use("/graphql",cors(),graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.listen(4000, () => {
    console.log("Listening at :3000...");
});