const { Router } = require('express');
const router = Router();
const { ObjectId } = require('mongodb'); // 👈 이게 없으면 DB 조회할 때 에러납니다!

module.exports = function(db, passport){

  // 1. [추가됨] 채팅방 생성 또는 조회 (버튼 누르면 여기로 옴)
  router.post('/chat/request', async (req, res) => {
    try {
      // 로그인 안했으면 튕겨내기
      if (!req.user) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
      }

      const myId = new ObjectId(req.user._id);
      const writerId = new ObjectId(req.body.writerId);

      // 1. 이미 채팅방이 있는지 확인 (나와 상대방이 모두 포함된 방)
      // $all: 순서 상관없이 배열 안에 두 값이 다 들어있는지 확인
      let chatRoom = await db.collection('chatroom').findOne({
        member: { $all: [myId, writerId] }
      });

      // 2. 없으면 새로 만들기
      if (!chatRoom) {
        const newRoom = await db.collection('chatroom').insertOne({
          member: [myId, writerId], // 참여자 목록
          date: new Date(),
          postId: new ObjectId(req.body.postId) // 어떤 글에서 왔는지 (선택사항)
        });
        
        // 방금 만든 방의 ID 가져오기
        chatRoom = { _id: newRoom.insertedId };
      }

      // 3. 방 ID를 클라이언트에게 응답
      res.json({ roomId: chatRoom._id });

    } catch (e) {
      console.error(e);
      res.status(500).send('서버 에러');
    }
  });


  // 2. [경로 수정됨] 채팅방 입장 (/room/:id -> /chat/room/:id)
  // server.js에서 app.use('/', ...)로 했으므로 여기서 경로를 명확히 적어줘야 함
  router.get('/chat/room/:id', async (req, res) => {
    try {
      // 1. 채팅방 정보 조회
      const room = await db.collection('chatroom').findOne({ _id: new ObjectId(req.params.id) });
      
      if(!room) return res.status(404).send('없는 채팅방입니다.');

      // 2. 과거 메시지 내역 가져오기
      const messages = await db.collection('message')
        .find({ parent_room: new ObjectId(req.params.id) })
        .toArray();

      // 3. 화면 렌더링
      res.render('chat.ejs', { 
          roomId: req.params.id, 
          messages: messages,
          user: req.user 
      });

    } catch (e) {
      console.error(e);
      res.status(500).send('에러');
    }
  });

  return router;
}