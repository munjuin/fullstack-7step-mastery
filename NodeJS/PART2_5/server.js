const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 60 * 60 * 1000},
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    dbName: 'forum',
  })
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done)=>{
  try {
    const user = await db.collection('user').findOne({username : username});
    if(!user){
      return done(null, false, {message: '존재하지 않는 아이디입니다'});
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){
      return done(null, false, {message: '비밀번호가 일치하지 않습니다'});
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}))

passport.serializeUser((user, done)=>{
  process.nextTick(()=>{
    done(null, {id: user._id, username: user.username})
  })
})

passport.deserializeUser(async (user, done)=>{
  try {
    const result = await db.collection('user').findOne({username: user.username});
    if(result){
      delete result.password;
    }
    process.nextTick(()=>{
      return done(null, result);
    })
  } catch (error) {
    done(error);
  }
})

const uri = process.env.MONGODB_URI;

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
    console.log('MongoDB에 성공적으로 연결되었습니다');
    
    db = client.db('forum');
    
    app.listen(8080, ()=>{
      console.log(`http://localhost:8080 에서 서버 실행 중`);
    })
    
  } catch (error){
    console.error('MongoDB 연결 실패', error);
    process.exit(1);
  }
}
//서버 시작 함수 호출
run();

// 로그인 검사 함수
function isLogin(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
}

// list페이지 접속 api
app.get('/', async (req, res)=>{
  let result = await db.collection('post').find().toArray();
  // console.log(result);
  res.render('list.ejs', {posts: result})
})

// 회원가입 페이지 접속 api
app.get('/register', (req, res)=>{
  res.render('register.ejs');
})

// 회원가입 요청 api
app.post('/register', async (req, res)=>{
  try {
    const { username, password } = req.body;
    if(!username || !password){
      return res.status(400).send('아이디와 비번을 모두 입력하세요');
    }
    const exsitingUser = await db.collection('user').findOne({username});
    if(exsitingUser){
      return res.status(409).send('이미 존재하는 아이디 입니다')
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('user').insertOne({username : username, password : hashedPassword});
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('서버 오류');
  }
})

// 로그인 페이지 접속 api
app.get('/login', (req, res)=>{
  res.render('login.ejs')
})

// 로그인 요청 api
app.post('/login', async (req, res, next)=>{
  // console.log(req.session);
  passport.authenticate('local', (error, user, info)=>{
    if(error) return res.status(500).json(error);
    if(!user) return res.status(401).json(info.message);
    req.logIn(user, (error)=>{
      if(error) return res.status(500).json(error);
      return res.redirect('/');
    })
  })(req, res, next);
})

// 글 작성 페이지 접속 api
app.get('/write', isLogin, (req, res)=>{
  res.render('write.ejs')
})

app.post('/write', isLogin, async (req, res)=>{
  await db.collection('post').insertOne({title: req.body.title, content: req.body.content, user: req.user._id, username: req.user.username});
  res.redirect('/');
})

app.get('/detail/:id', async (req, res)=>{
  let result = await db.collection('post').findOne({_id: new ObjectId(req.params.id)});
  res.render('detail.ejs', {post: result});
})

app.get('/edit/:id', isLogin, async (req, res)=>{
  let result = await db.collection('post').findOne({_id: new ObjectId(req.params.id)});
  if(result.user.toString() === req.user._id.toString() && result.username.toString() === req.user.username.toString()){
    res.render('edit.ejs', {post: result})
  } else {
    res.redirect('/');
  }
})

app.put('/edit/:id', isLogin, async (req, res)=>{
  let result = await db.collection('post').findOne({_id: new ObjectId(req.params.id)});
  if(result.user.toString() === req.user._id.toString() && result.username.toString() === req.user.username.toString()){
    await db.collection('post').updateOne({_id: new ObjectId(req.params.id)}, {$set: {title: req.body.title, content: req.body.content}});
    res.redirect('/');
  } else {
    res.send('글수정실패')
  }
})

app.delete('/delete/:id', isLogin, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await db.collection('post').findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return res.status(404).send('존재하지 않는 글입니다.');
    }
    if (post.user.toString() === req.user._id.toString()) {
      await db.collection('post').deleteOne({ _id: new ObjectId(postId) });
      res.status(200).send('삭제성공');
      
    } else {
      res.status(403).send('작성자 불일치');
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('서버 에러');
  }
});