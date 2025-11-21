const { Router } = require('express');
const router = Router();

module.exports = function(db, passport){
  
  router.get('/search', async (req, res) => {
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

  return router;
}