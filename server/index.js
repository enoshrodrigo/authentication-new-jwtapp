const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

const users=[
    {"email":"2334","username":"bob","id":"22","password":"123345","isadmin":false},
    {"email":"555","username":"ena","id":"2","password":"555","isadmin":true},
    {"email":"6666","username":"cam","id":"52","password":"54551","isadmin":true},
    {"email":"55558","username":"err","id":"2992","password":"5558","isadmin":true},

]


let refreshTokens =[];
app.post("/api/refresh",(req,res)=>{
    //take the refresh token from the user 

    const refreshToken = req.body.token;
    !refreshToken?res.status(401).json("You are not authnticated for refresh"):null;
    !refreshTokens.includes(refreshToken)? res.status(403).json("Refersh token not valid"):null;

    jwt.verify(refreshToken,"myRefreshSecretKey",(err,user)=>{
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token)=>token !==refreshToken)

    const newAccesToken = genarateAccesToken(user);
    const newRefreshToken = genarateRefreshToken(user);
    refreshTokens.push(newRefreshToken);

    res.status(200).json({
        accesToken:newAccesToken , 
        refreshToken:newRefreshToken
    })
    })

   
    
    //send error if there us no token or it's invalid

    //if everything is ok, create new acces token , refresh token
})

const genarateAccesToken = (user)=>{
return jwt.sign({id:user.id,isadmin:user.isadmin},"mySecretKey",{expiresIn:"20s"}); 
}

const genarateRefreshToken = (user)=>{
    return jwt.sign({id:user.id,isadmin:user.isadmin},"myRefreshSecretKey");
}



app.post('/api/login',  (req,res)=>{ 
const {username,password}=req.body;
const user=  users.find(u=>{ 
    return u.username ===username && u.password ===password
})
console.log(user);
if(user){
// res.json(user)
 const accesToken = genarateAccesToken(user);
 const refreshToken =genarateRefreshToken(user);
 refreshTokens.push(refreshToken);


res.json({
    username:user.username,
    isadmin:user.isadmin,
    accesToken:accesToken,
    refreshToken:refreshToken,
    id:user.id
    

})
}else {
    res.status(404).json("User name or Password incorrect")
}
})


const verify=(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token= authHeader.split(" ")[1];
        jwt.verify(token,"mySecretKey",(err,user)=>{
            if(err){

                res.status(403).json("Token is not valid")
            }else{
                console.log(user)
                // console.log("Delete token "+token)

                req.user=user;
                next();
            }
        })

    }else{
        res.status(401).json("You are not authentiaction");
    }
}

app.delete('/api/users/:userId',verify,(req,res)=>{
    console.log(req.user.id )
    console.log(req.params.userId)

    if(req.user.id === req.params.userId || req.user.isadmin){

        res.status(200).json("User has been deleted");
    }else{
        res.status(403).json("You are no allowed to delete user");
    }
})

app.post("/api/logout",verify,(req,res)=>{
    const refreshToken =req.body.token;
    refreshTokens=refreshTokens.filter((token)=>token !=refreshToken);
    res.status(200).json("You are loged out")

        
})


app.listen('5000',()=>{
    console.log("server sarted on port");
    })