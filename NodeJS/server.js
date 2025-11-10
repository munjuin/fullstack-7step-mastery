require('dotenv').config();
const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.set('view engine', 'ejs');

const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 8080;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// DB 객체를 저장할 전역 변수를 하나 만듬
let db;

// DB 연결을 시도하고, 성공하면 Express 서버를 실행하는 함수(테스트코드 재활용)
async function run() {
  try {
    //client.connect()는 Promise를 반환함(await를 앞에 붙여야 함)
    await client.connect();
    console.log('MongoDB에 성공적으로 연결되었습니다');

    //  'forum' 데이터베이스를 db 변수에 할당(mongoDB에서 내가 연결하려는 DB)
    db = client.db('forum');
    
    // DB 연결이 성공한 후 Express 서버를 시작
    app.listen(PORT, ()=>{
      console.log(`http://localhost:${PORT} 에서 서버 실행 중`);
    })

  } catch (error){
    //연결 실패 시 에러를 출력하고 서버를 종료
    console.error('MongoDB 연결 실패', error);
    process.exit(1);
    
  }
}
//서버 시작 함수 호출
run();

app.get('/', (req, res)=>{
  // res.send('하이');
  res.sendFile(__dirname + '/index.html')
})

app.get('/news', (req, res)=>{
  res.send('뉴스 페이지');
  // db.collection('post').insertOne({title : '어쩌구'});
})

app.get('/shop', (req, res)=>{
  res.send('쇼핑 페이지');
})

app.get('/about', (req, res)=>{
  res.sendFile(__dirname + '/about.html');
})

app.get('/time', (req, res)=>{
  res.render('time.ejs', { time : new Date() });
})

app.get('/notice', async (req, res)=>{
  let result = await db.collection('notice').find().toArray();
  // console.log(result);
  res.render('notice.ejs', { notices : result })
})

app.get('/list', async (req, res)=>{
  // res.send('리스트페이지');
  let result = await db.collection('post').find().toArray();
  // console.log(result[0]);
  // res.send(result[0].title);
  res.render('list.ejs', { posts : result })
})

app.get('/write', (req, res)=>{
  try {
    res.render('write.ejs');
  } catch (error) {
    console.error(error);
    res.status(500).send('페이지 렌더링 중 오류 발생');
  }
})

app.post('/add', async (req, res)=>{
  try {
    if (req.body.title === '' || req.body.content === ''){
      res.status(400).send('제목과 내용을 입력해주세요')
      return;
      
    }
    // console.log(req.body);
    await db.collection('post').insertOne({title: req.body.title, content: req.body.content});
    res.redirect('/list');
    
  } catch (error) {
    console.error(error);
    res.status(500).send('데이터 저장 중 서버 오류 발생');
  }
})

app.get('/detail/:id', async (req, res)=>{
  // console.log(req.params);
  try {
    let result = await db.collection('post').findOne({_id : new ObjectId(req.params.id)});
    // console.log(result);
    if (result === null){
      res.status(404).send('해당하는 게시물을 찾을 수 없습니다.');
      return;
    }
    
    res.render('detail.ejs', { post : result });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('데이터 조회 중 서버 오류 발생');
  }
})

app.get('/edit/:id', async (req, res)=>{
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

app.post('/update/:id', async (req, res)=>{
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

    res.redirect('/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('데이터 업데이트 중 서버 오류 발생');
  }
})

app.delete('/delete/:id', async (req, res)=>{
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