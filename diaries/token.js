const jwt = require('jsonwebtoken');
const secret = "cronnie7";
function setUser(user){
    return jwt.sign({
        name:user.fullName,
        _id:user._id,
        email:user.email
    },secret)
}
function getUser(token){
    if(!token){return null};
    return jwt.verify(token,secret);
}
module.exports = {
    setUser,
    getUser
}//by putting the fns inside {} we create an object and if we want to access any one of these fns
//we import it by const {fn_name}=require('./...')
//we can do it by using the dot notation like this: module.exports.setUser