const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT} 에서 서버 실행 중`);
})

app.get('/', (req, res)=>{
  // res.send('하이');
  res.sendFile(__dirname + '/index.html')
})

app.get('/news', (req, res)=>{
  res.send('날씨 페이지');
})

app.get('/shop', (req, res)=>{
  res.send('쇼핑 페이지');
})

app.get('/about', (req, res)=>{
  res.sendFile(__dirname + '/about.html');
})