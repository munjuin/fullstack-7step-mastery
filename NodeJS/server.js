require('dotenv').config();
const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
  }
}))
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, cb) => {
  let result = await db.collection('user').findOne({ username : username })
  if (!result) {
    return cb(null, false, { message: '아이디 DB에 없음' })
  }
  const isMatch = await bcrypt.compare(password, result.password);
  if(isMatch){
    return cb(null, result);
  } else {
    return cb(null, false, { message: '비번불일치' });
  }
}))

passport.serializeUser((user, done)=>{
  process.nextTick(()=>{
    done(null, {id: user._id, username: user.username});
  })
})

passport.deserializeUser(async (user, done)=>{
  let result = await db.collection('user').findOne({_id : new ObjectId(user.id)});
  if (result) {
    delete result.password;
    process.nextTick(()=>{
      return done(null, result); 
    })
  }
})
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

function checkLogin(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
}

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

// app.get('/list', async (req, res)=>{
//   // res.send('리스트페이지');
//   let result = await db.collection('post').find().toArray();
//   // console.log(result[0]);
//   // res.send(result[0].title);
//   res.render('list.ejs', { posts : result })
// })

app.get('/list/:page', async (req, res)=>{
  // console.log(req.user);
  let result = await db.collection('post').find().skip((req.params.page -1) * 5).limit(5).toArray();
  res.render('list.ejs', { posts : result });
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
    res.redirect('/list/1');
    
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

app.put('/update/:id', async (req, res)=>{
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

// 회원 가입 페이지 접속 api
app.get('/register', (req, res)=>{
  res.render('register.ejs')
})

// 회원 가입 요청 api
app.post('/register', async (req, res)=>{
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
app.get('/login', (req, res)=>{
  res.render('login.ejs');
})

// 로그인 요청 api
app.post('/login', async (req, res, next)=>{
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
app.get('/mypage', checkLogin, async (req, res)=>{
  console.log(req.user);
  res.render('mypage.ejs', { user : req.user });
})