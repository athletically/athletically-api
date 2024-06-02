const responseLib = require('../libs/responseLib');
const token = require('../libs/tokenLib');
const check = require('../libs/checkLib');
const appConfig = require('../../config/appConfig');

let isAuthorized = async (req, res, next) => {
  try{
    if (req.header('authorization') && !check.isEmpty(req.header('authorization'))) {
      let token_str = req.header('authorization');
      token_str = token_str.replace("Bearer ", "");
      let decoded = await token.verifyClaimWithoutSecret(token_str);
      req.user = decoded.user;
      next();
    } else {
      let apiResponse = responseLib.generate(true,'AuthorizationToken Is Missing In Request',null);
      res.status(403)
      res.send(apiResponse)
    }
  }catch(err){
    let apiResponse = responseLib.generate(true,err.message,null);
    res.status(403)
    res.send(apiResponse)
  }
}

let firebaseAuth = async (req,res,next) => {
  if (req.header('token') && !check.isEmpty(req.header('token'))) {
    try{
      let checkAuth = await appConfig.admin.auth().verifyIdToken(req.header('token'));
      next();
    }catch(err){
      let apiResponse = responseLib.generate(0, `${err.message}`, null)
      res.status(401).send(apiResponse)
    }
  } else {
    let apiResponse = responseLib.generate(0, 'AuthorizationToken Is Missing In Request', null)
    res.status(401).send(apiResponse)
  }
}

let isAuthorizedSocket = async (socket,next) => {
  try {
    let socketToken;
    if (socket.handshake.query.auth_token) {
        socketToken = socket.handshake.query.auth_token;
    }
    // console.log(socketToken);
    const decoded = await token.verifyClaimWithoutSecret(socketToken);
    // console.log(decoded);
    if (!decoded) {
        console.log("Invalid token");
    }
    socket.user = decoded.user;
    socket.user.user_id = decoded.user._id;
    // console.log(socket.user);
    next();
} catch (err) {
    console.log('ERROR => ' + err);
}
}

module.exports = {
  isAuthorized: isAuthorized,
  firebaseAuth:firebaseAuth,
  isAuthorizedSocket:isAuthorizedSocket
}
