const { Router } = require('express');
const router = Router();
const { checkLogin } = require('../middlewares/index.js');


module.exports = function(){
  router.get('/board/sub/sports', checkLogin, (req, res) => {
    res.send('스포츠 게시판') 
  })  
  router.get('/board/sub/game', checkLogin, (req, res) => {
    res.send('게임 게시판')
}) 
return router;
}