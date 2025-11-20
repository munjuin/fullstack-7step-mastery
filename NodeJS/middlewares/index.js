function checkLogin(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
}

function checkTime(req, res, next){
  console.log(new Date());
  next();
}

function checkCredentials(req, res, next){
  if(req.body.username === '' || req.body.password === ''){
    return res.status(400).send('아이디 혹은 비밀번호를 입력해주세요');
  }
  next();
}

module.exports = { checkLogin, checkCredentials, checkTime };