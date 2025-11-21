const { Router } = require('express');
const { ObjectId } = require('mongodb');

const router = Router();

module.exports = function(db){
  // router.get('/list', async (req, res)=>{
//   // res.send('리스트페이지');
//   let result = await db.collection('post').find().toArray();
//   // console.log(result[0]);
//   // res.send(result[0].title);
//   res.render('list.ejs', { posts : result })
// })

  router.get('/list/:page', async (req, res)=>{
    // console.log(req.user);
    let result = await db.collection('post').find().skip((req.params.page -1) * 5).limit(5).toArray();
    res.render('list.ejs', { posts : result });
  })
  
  router.get('/write', (req, res)=>{
    try {
      res.render('write.ejs');
    } catch (error) {
      console.error(error);
      res.status(500).send('페이지 렌더링 중 오류 발생');
    }
  })
  
  router.post('/add', async (req, res)=>{
    try {
      if (req.body.title === '' || req.body.content === ''){
        res.status(400).send('제목과 내용을 입력해주세요')
        return;
        
      }
      // console.log(req.body);
      await db.collection('post').insertOne({title: req.body.title, content: req.body.content});
      res.redirect('/list/1');
      
    } catch (error) {
      console.error(error);
      res.status(500).send('데이터 저장 중 서버 오류 발생');
    }
  })
  
  router.get('/detail/:id', async (req, res)=>{
    try {
      let post = await db.collection('post').findOne({_id : new ObjectId(req.params.id)});
      
      if (post === null){
        res.status(404).send('해당하는 게시물을 찾을 수 없습니다.');
        return;
      }
  
      let comments = await db.collection('comment')
        .find({ parent_id : new ObjectId(req.params.id) })
        .toArray();

        // [수정됨] user: req.user 를 추가해서 EJS로 로그인 정보를 보냅니다.
      res.render('detail.ejs', { post : post, comments : comments, user : req.user });
      
    } catch (error) {
      console.error(error);
      res.status(500).send('데이터 조회 중 서버 오류 발생');
    }
  })

  router.get('/edit/:id', async (req, res)=>{
    try {
      let result = await db.collection('post').findOne({_id : new ObjectId(req.params.id)});
      if (result === null){
        res.status(404).send('해당하는 게시물을 찾을 수 없습니다.');
        return;
    }
      res.render('edit.ejs', { post : result })
    
    } catch (error) {
      console.error(error);
      res.status(500).send('데이터 조회 중 서버 오류 발생');
    }
  })
  
  router.put('/update/:id', async (req, res)=>{
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        res.status(400).send('제목과 내용을 입력해주세요');
        return;
      }
  
      const result = await db.collection('post').updateOne( { _id : new ObjectId(req.params.id)}, {$set : {title : req.body.title, content : req.body.content}})
  
      if(result.modifiedCount === 0){
        res.status(404).send('해당하는 게시물을 찾을 수 없습니다.');
        return;
      }
  
      res.redirect('/list/1');
    } catch (error) {
      console.error(error);
      res.status(500).send('데이터 업데이트 중 서버 오류 발생');
    }
  })
  
  router.delete('/delete/:id', async (req, res)=>{
    try {
      // console.log(req.params);
  
      let result = await db.collection('post').deleteOne({_id : new ObjectId(req.params.id)});
  
      if (result.deletedCount === 0) {
        return res.status(404).send('삭제할 게시물을 찾지 못했습니다.');
      }
  
      res.status(200).json({ message: '삭제 성공' });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('서버 오류로 삭제에 실패했습니다.');
    }
  });

  return router;

}