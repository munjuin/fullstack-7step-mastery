const { Router } = require('express');
const { ObjectId } = require('mongodb');
const { checkLogin, checkCredentials } = require('../middlewares/index.js');

const router = Router();

module.exports = function(db){
  // 2. 댓글 작성 기능 (POST) - 신규 추가
  router.post('/comment', async (req, res) => {
    try {
      // 로그인 안 한 유저 차단 (선택사항이나 추천)
      if (!req.user) {
        return res.send('<script>alert("로그인이 필요합니다."); location.href="/login";</script>');
      }

      const { content, postId } = req.body;

      if (!content || content.trim() === '') {
        return res.send('<script>alert("내용을 입력해주세요."); history.back();</script>');
      }

      // DB에 저장할 데이터
      await db.collection('comment').insertOne({
        content: content,
        writer: req.user.username, // 로그인한 유저의 아이디
        parent_id: new ObjectId(postId), // [핵심] 문자열 ID를 ObjectId로 변환하여 저장
        createdAt: new Date() // (옵션) 작성 시간 저장
      });

      // 댓글 작성 후 다시 해당 게시물 상세 페이지로 리다이렉트
      res.redirect('/detail/' + postId);

    } catch (error) {
      console.error(error);
      res.status(500).send('댓글 저장 중 오류 발생');
    }
  });

  router.delete('/comment/delete/:id', async (req, res) => {
    try {
      // 1. 로그인 안 했으면 거절
      if (!req.user) {
        return res.send('<script>alert("로그인이 필요합니다."); location.href="/login";</script>');
      }

      const commentId = req.params.id; // 삭제할 댓글 ID
      const postId = req.body.postId;  // 삭제 후 돌아갈 게시물 ID (hidden input으로 받음)

      // 2. DB에서 삭제 요청
      // 조건: _id가 일치하고(AND) writer가 현재 로그인한 유저(req.user.username)인 것만 삭제
      let result = await db.collection('comment').deleteOne({
        _id: new ObjectId(commentId),
        writer: req.user.username 
      });

      // 3. 결과 처리
      if (result.deletedCount === 0) {
        // 삭제된 게 없다면? -> 글이 없거나, 니 글이 아니거나
        return res.status(400).send('<script>alert("삭제 권한이 없거나 이미 삭제된 댓글입니다."); history.back();</script>');
      }

      // 4. 성공 시 원래 게시물 페이지로 복귀
      res.redirect('/detail/' + postId);

    } catch (error) {
      console.error(error);
      res.status(500).send('댓글 삭제 중 오류 발생');
    }
  });
  return router;
}

