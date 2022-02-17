const jwt = require('jsonwebtoken');

const Verify = (req,res,next)=>{
    try{
        const token = req.get("Authorization");
        jwt.verify(token,"timetable");
        next();
    }catch{
        res.status(401).json("Error");
    }
}

module.exports = Verify;