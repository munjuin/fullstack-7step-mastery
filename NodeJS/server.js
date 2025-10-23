require('dotenv').config();
const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(express.static(__dirname + '/public'));

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

app.get('/list', async (req, res)=>{
  let result = await db.collection('post').find().toArray();
  // console.log(result);
  res.send(result);
})