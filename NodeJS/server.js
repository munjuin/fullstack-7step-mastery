const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT} 에서 서버 실행 중`);
})

app.get('/', (req, res)=>{
  res.send('하이');
})