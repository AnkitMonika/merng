const Express = require("express");
const ExpressGraphQL = require("express-graphql");
const mongoose = require("mongoose");
const { MONGO } = require('./global')
const {schema}=require('./graphql/schema')


var app = Express();

mongoose.connect(MONGO,{useNewUrlParser:true,useUnifiedTopology:true}).
then(()=>{
    console.log("monodb connected")
},err=>{Console.log(err)});

app.use("/graphql", ExpressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log("Listening at :3000...");
});