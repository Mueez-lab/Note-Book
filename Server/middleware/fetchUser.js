var jwt = require('jsonwebtoken');

const secretToken = "vbnmkbbbbl";
const fetchusers =(req,res,next)=>{
    // Get the token from the awt_token 
    const token = req.header("auth_token")
    if(!token)
    {
        res.status(4001).json({error: "please use a valid authentication"})
    }
    try {
        const data = jwt.verify(token,secretToken) // contain the payload of token
        // console.log(data.user); // real id  
        req.user = data.user; // The middleware attaches this information to the req object as req.user. This makes the user information available to any subsequent middleware or route handlers.
        next() // The next function is called to pass control to the next middleware function
    } catch (error) {
        res.status(4001).json({error: "please use a valid authentication"})
    }
}

module.exports= fetchusers;