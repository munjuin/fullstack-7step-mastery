const { Router } = require('express');
// const { ObjectId } = require('mongodb');
const { checkLogin, checkCredentials } = require('../middlewares/index.js');
const bcrypt = require('bcrypt');

const router = Router();

module.exports = function(db, passport){
    // 회원 가입 페이지 접속 api
  router.get('/register', (req, res)=>{
    res.render('register.ejs')
  })

  // 회원 가입 요청 api
  router.post('/register', checkCredentials, async (req, res)=>{
    try {
      const { username, password } = req.body;

      if (!username || !password || username.trim() === '' || password.trim() === '') {

        return res.status(400).send('<script>alert("아이디와 비밀번호를 모두 입력하세요."); window.location.href="/register";</script>');
      }

      const existingUser = await db.collection('user').findOne({ username: username });

      if (existingUser) {
        return res.status(409).send('<script>alert("이미 사용 중인 아이디입니다."); window.location.href="/register";</script>');
      }

      const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await db.collection('user').insertOne({
        username: username,
        password: hashedPassword,
      });

      console.log('회원가입 성공:', username);
      res.redirect('/list/1');

    } catch (error) {
      console.error('회원가입 중 심각한 오류 발생:', error);
      res.status(500).send('<script>alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."); window.location.href="/";</script>');
    }
  })

  // 로그인 페이지 접속 api
  router.get('/login', (req, res)=>{
    res.render('login.ejs');
  })

  // 로그인 요청 api
  router.post('/login', checkCredentials, async (req, res, next)=>{
    passport.authenticate('local', (error, user, info)=>{
      if(error) return res.status(500).json(error);
      if(!user) return res.status(401).json(info.message);
      req.logIn(user, (error)=>{
        if(error) return next(error);
        res.redirect('/list/1')
      })
    })(req, res, next)
  })

  // 마이 페이지 접속 api
  router.get('/mypage', checkLogin, (req, res)=>{
    console.log(req.user);
    res.render('mypage.ejs', { user : req.user });
  })

  return router;
}