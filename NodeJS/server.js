require('dotenv').config();
const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
// const { checkLogin, checkCredentials, checkTime } = require('./middlewares/index.js');

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
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    dbName: 'forum',
    collectionName: 'session',
    autoRemove: 'interval',
    autoRemoveInterval: 1
  }),
}))
app.use(passport.session());

// app.use('/list', checkTime);

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
    strict: false,
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

    app.use('/', require('./routes/post.js')(db));
    app.use('/', require('./routes/auth.js')(db, passport));
    app.use('/', require('./routes/comment.js')(db));
    app.use('/', require('./routes/aaa.js')());

    // 1. 기존 인덱스 삭제 (혹시 남아있을까봐 안전장치)
    try { await db.collection('post').dropIndex("title_text"); } catch (e) {}

    // 2. [핵심] 제목(title)과 내용(content) 둘 다 검색되는 인덱스 생성
    await db.collection('post').createIndex({ title: 'text', content: 'text' });
    console.log('✅ (제목+내용) 텍스트 인덱스 생성 완료!');
    
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
  // res.send('하이');`
  res.sendFile(__dirname + '/index.html')
})

// app.get('/news', (req, res)=>{
//   res.send('뉴스 페이지');
//   // db.collection('post').insertOne({title : '어쩌구'});
// })

// app.get('/shop', (req, res)=>{
//   res.send('쇼핑 페이지');
// })

// app.get('/about', (req, res)=>{
//   res.sendFile(__dirname + '/about.html');
// })

// app.get('/time', (req, res)=>{
//   res.render('time.ejs', { time : new Date() });
// })

// app.get('/notice', async (req, res)=>{
//   let result = await db.collection('notice').find().toArray();
//   // console.log(result);
//   res.render('notice.ejs', { notices : result })
// })

app.get('/search', async (req, res) => {
  // 1. 쿼리스트링에서 데이터 가져오기 (없으면 기본값 설정)
  const searchVal = req.query.val;
  // 페이지 정보가 없으면 1페이지로 간주, 숫자로 변환
  const page = parseInt(req.query.page) || 1; 
  
  // 2. 한 페이지에 보여줄 개수 설정
  const itemsPerPage = 3;

  // 3. skip 공식 적용
  const skipCount = (page - 1) * itemsPerPage;

  try {
    let result = await db.collection('post')
      .find({ title : { $regex : searchVal } })
      .skip(skipCount)    // 앞에서부터 몇 개 건너뛸지
      .limit(itemsPerPage) // 몇 개만 가져올지
      .toArray();

    // 4. 렌더링 (현재 페이지랑 검색어도 같이 보내줘야 버튼을 만듦!)
    res.render('search.ejs', { 
      posts : result, 
      currentPage : page,
      searchVal : searchVal 
    });

  } catch (e) {
    console.error(e);
    res.status(500).send('검색 중 오류 발생');
  }
})