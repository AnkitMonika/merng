const {AuthenticationError} =require('apollo-server')

const jwt=require('jsonwebtoken')
const {SECRET_KEY} = require('../../global')

module.exports=(context)=>{
    //context={..headers}
    
    const authHeader=context.headers.authorization;
    if(authHeader){
        //Bearer ...
        const token=authHeader.split('Bearer ')[1];
        if(token){
            try{
                const user=jwt.verify(token,SECRET_KEY);
                return user;
            }
            catch(err){
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]')
    }
    throw new Error('Authorization header token must be provided')
}