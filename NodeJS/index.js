require('dotenv').config();
const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 8080;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function run() {
  try {
    await client.connect();
    console.log("mongoDB 연결성공");
    
    db = client.db('forum');

    app.listen(PORT, ()=>{
      console.log(`http://localhost:${PORT} 에서 서버 실행 중`);
    })

  } catch(err) {
    console.error('mongoDB 연결실패', err);
    process.exit(1);
  }
}
run();

app.get('/', (req, res)=>{
  res.send('하이')
})

app.get('/list', async (req, res)=>{
  let result = await db.collection('post').find().toArray();
  res.render('list.ejs', { posts: result })
})