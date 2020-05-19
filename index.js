const Express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const { MONGO } = require('./global')
const graphqlHTTP = require('express-graphql');
const { schema } = require('./graphql/schema')
const cors = require('cors')

var app = Express();

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true }).
    then(() => {
        console.log("monodb connected")
    }, err => { Console.log(err) });


//app.options('*', cors());
app.use(cors())
app.use("/graphql", bodyParser.json(), graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.listen(4000, () => {
    console.log("Listening at :3000...");
});