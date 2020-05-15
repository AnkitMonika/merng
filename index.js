const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose=require('mongoose')
const Post =require('./models/Post')
const User =require('./models/User');
var config = require('./global')
const schema=require('./graphql2/schema')
const checkAuth=require('./util/check-auth')
const {validateRegisterInput,validateLoginInput}=require('./util/validators')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const {UserInputError,AuthenticationError} =require('apollo-server')
//const resolvers=require('./graphql2/resolvers2')
const {MONGO,SECRET_KEY}=config

//const SECRET_KEY='some very secret'
function generateToken(user){
    return jwt.sign({
        id:user.id,
        email:user.email,
        username:user.username
    },SECRET_KEY,{expiresIn:'1h'});
}


// Post:{
//     likeCount:(parent)=> parent.likes.length,        
//     commentCount:(parent)=>parent.comments.length        
// },
// Query:{
//     ...postsResolvers.Query
// },
// Mutation:{
//     ...userResolvers.Mutation,
//     ...postsResolvers.Mutation
// }

const resolvers={
    Post:{
        likeCount:(parent)=> parent.likes.length,        
        commentCount:(parent)=>parent.comments.length        
    },  
  Query:{
    async getPosts(){
         try{
             const posts=await Post.find().sort({createdAt:-1});
             return posts;
         }catch(err){
             throw new Error(err);
         }
     },
     async getPost(_,{postId}){
        try{
            const post=await Post.findById(postId);
            if(post){
                return post;
            }
            else{
                throw new Error('Post not found');
            }
        }catch(err){
            throw new Error(err);
        }
    
    }
  },
  Mutation:{
    async login(_,{username,password}) {
      const {errors,valid}=validateLoginInput(username,password);
      if(!valid){
          throw new UserInputError('Errors',{errors});
      }
      const user =await User.findOne({username});
      if(!user){
          errors.general='User not found';
          throw new UserInputError('User not found',{errors});
      }
      else{
         const match=await bcrypt.compare(password,user.password);
         if(!match){
          errors.general='Wrong credentials';
          throw new UserInputError('Wrong credentials',{errors});
         }
      }
      const token=generateToken(user);
      return{
          ...user._doc,
          id:user.id,
          token
      };
    },
    async register(_,{registerInput:{username,email,password,confirmPassword}})
    {
        //validate user data
        const {valid,errors}=validateRegisterInput(username,email,password,confirmPassword);
        if(!valid){
            throw new UserInputError('Errors',{errors});
        }
        //Make sure user does not already exist
        const user=await User.findOne({username})
        if(user){
                throw new UserInputError("Username is taken",{
                    errors:{
                        username:'This username is already taken'
                    }
                })
        }
        //hash password and crete an auth token
        password=await bcrypt.hash(password,12);

        const newUser=new User({
            email,
            username,
            password,
            createdAt:new Date().toISOString()
        });

        const res=await newUser.save();

        const token=generateToken(res);

        return{
            ...res._doc,
            id:res.id,
            token
        };
    },
    async createPost(_,{body},context){
        const user=checkAuth(context);
        const newPost=new Post({
            body,
            user:user.id,
            username:user.username,
            createdAt:new Date().toISOString()

        });
        const post=await newPost.save();
        return post;
    },
    async deletePost(_,{postId},context){
       const user=checkAuth(context);
       try{
           const post=await Post.findById(postId)
           if(user.username===post.username){
               await post.delete();
               return "Post deleted successfully"
           }
           else{
               throw new AuthenticationError('Action not allowed');
           }
       }
       catch(err){
           throw new Error(err);
       }
    },
    createComment:async(_,{postId,body},context)=>{
         const {username}=checkAuth(context)
         if(body.trim()===''){
             throw new UserInputError('Empty comment',{
                 errors:{
                     body:'Comment body must not empty'
                 }
             });
         }  
         const post=await Post.findById(postId);
         if(post){
             post.comments.unshift({
                 body,
                 username,
                 createAt:new Date().toISOString()
             });
             post.save();
         }
         else{
             throw new UserInputError("Post not found")
         }
    },
    async deleteComment(_,{postId,commentId},context){
        const {username}=checkAuth(context);

        const post=Post.findById(postId);
        if(post){
            const commentIndex=post.comments.findIndex(c=>c.id===commentId);
            if(post.comments[commentIndex].username=username){
                post.comments.splice(commentIndex,1);
                await post.save();
                return post;
            }
            else{
                throw new AuthenticationError('Action nor allowed');
            }
        }else{
            throw new UserInputError('Post not found');
        }


    },
    async likePost(_,{postId},context){
        const {username} =checkAuth(context);

        const post =await Post.findById(postId);

        if(post){
            if(post.likes.find(like=>like.username===username)){
                //Post already liked
                post.likes=post.likes.filter(like=>like.username!==username);
                
            }
            else{
                //Not liked
                post.likes.push({
                    username,
                    createdAt:new Date().toISOString()
                });

            }
            await post.save();
            return post;
        }
        else{
            throw new UserInputError('Post not found');
        }

    }
  }

}

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
  rootValue: resolvers,
  graphiql: true
}));
app.listen(4000);

console.log(`Server ready at http://localhost:4000/graphql`);