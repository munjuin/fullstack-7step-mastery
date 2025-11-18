# Node.js로 만든 CRUD 게시판 (my-first-nodejs-server)

Node.js, Express, MongoDB를 사용해 만든 **로그인 및 CRUD(생성, 읽기, 수정, 삭제) 기능**이 포함된 게시판 서버입니다.

---

## 사용된 기술 스택

- Node.js
- Express
- MongoDB
- EJS (Embedded JavaScript templates)
- dotenv (환경 변수 관리)
- express-session (세션 관리)
- passport (로그인 인증)
- passport-local (로컬 로그인 전략)
- method-override (HTML Form에서 PUT, DELETE 요청)

---

## 설치 방법

1. 레포지토리를 클론합니다.

   ```bash
   git clone [https://github.com/munjuin/fullstack-7step-mastery.git](https://github.com/munjuin/fullstack-7step-mastery.git)
   ```

2. 프로젝트 디렉토리로 이동합니다.

   ```bash
   cd NodeJS
   ```

3. 필요한 패키지를 설치합니다.

   ```bash
   npm install
   ```

4. `.env` 파일을 루트 디렉토리에 생성하고 필요한 환경 변수를 설정합니다.

   ```text
   # MongoDB 접속 문자열
   DB_URL=mongodb+srv://...

   # Express-Session 암호화 키
   SESSION_SECRET=abc1234
   ```

---

## 실행 방법

```bash
npm start

```

# API 명세서

## 1. PART.1: 기본 페이지 및 데이터 조회

서버에서 EJS 템플릿을 렌더링하여 완전한 HTML 페이지로 반환합니다.

| Method | Endpoint  | 주요 기능                                                                      | 응답 형식   |
| :----- | :-------- | :----------------------------------------------------------------------------- | :---------- |
| `GET`  | `/`       | 메인 페이지(`index.ejs`)를 렌더링합니다.                                       | `text/html` |
| `GET`  | `/list`   | **`post`** 컬렉션의 모든 문서를 조회하여 `list.ejs` 템플릿에 렌더링합니다.     | `text/html` |
| `GET`  | `/notice` | **`notice`** 컬렉션의 모든 문서를 조회하여 `notice.ejs` 템플릿에 렌더링합니다. | `text/html` |

## 2. PART.2: 게시판 CRUD (Create, Read, Update, Delete)

RESTful API 원칙에 따른 게시물 생성, 조회, 수정, 삭제 기능입니다.

| Method   | Endpoint      | 주요 기능                                                                                                            | 응답 형식    |
| :------- | :------------ | :------------------------------------------------------------------------------------------------------------------- | :----------- |
| `GET`    | `/detail/:id` | `_id`가 `:id`와 일치하는 게시물을 `post` 컬렉션에서 조회하여 `detail.ejs`에 렌더링합니다.                            | `text/html`  |
| `GET`    | `/write`      | 글 작성 페이지(`write.ejs`)를 렌더링합니다. **(로그인 필요)**                                                        | `text/html`  |
| `POST`   | `/add`        | 글 작성 폼에서 전송된 `{title, content}` 데이터를 `post` 컬렉션에 `insertOne` 합니다. **(로그인 필요)**              | `Redirect`   |
| `GET`    | `/edit/:id`   | `_id`가 `:id`와 일치하는 게시물 정보를 `edit.ejs` 템플릿에 렌더링합니다. **(본인 확인 필요)**                        | `text/html`  |
| `PUT`    | `/edit`       | (Form + `method-override`) 수정 폼에서 전송된 정보로 `post` 컬렉션의 문서를 `updateOne` 합니다. **(본인 확인 필요)** | `Redirect`   |
| `DELETE` | `/delete`     | (AJAX) 쿼리 스트링으로 전송된 `_id`를 기준으로 `post` 컬렉션의 문서를 `deleteOne` 합니다. **(본인 확인 필요)**       | `text/plain` |

## 3. PART.2: 회원 기능 (Auth)

`passport`와 `express-session`을 이용한 회원가입 및 로그인/로그아웃 기능입니다.

| Method | Endpoint    | 주요 기능                                                                             | 응답 형식   |
| :----- | :---------- | :------------------------------------------------------------------------------------ | :---------- |
| `GET`  | `/login`    | 로그인 페이지(`login.ejs`)를 렌더링합니다.                                            | `text/html` |
| `GET`  | `/register` | 회원가입 페이지(`register.ejs`)를 렌더링합니다.                                       | `text/html` |
| `POST` | `/login`    | `passport.authenticate('local')` 미들웨어를 통해 로그인을 시도하고 세션을 생성합니다. | `Redirect`  |
| `POST` | `/register` | 폼에서 전송된 `{username, password}` 데이터로 `user` 컬렉션에 새 사용자를 생성합니다. | `Redirect`  |
| `GET`  | `/logout`   | `req.logout()`을 호출하여 세션을 종료(로그아웃)합니다.                                | `Redirect`  |
| `GET`  | `/mypage`   | `req.user` 객체의 정보를 `mypage.ejs`에 렌더링합니다. **(로그인 필요)**               | `text/html` |

## 4. PART.2: 댓글 기능 (Comment)

게시물 상세 페이지(`detail.ejs`)에서 동작하는 댓글 기능입니다.

| Method | Endpoint   | 주요 기능                                                                                              | 응답 형식  |
| :----- | :--------- | :----------------------------------------------------------------------------------------------------- | :--------- |
| `POST` | `/comment` | 폼에서 전송된 `{content, parent_id}` 데이터를 `comment` 컬렉션에 `insertOne` 합니다. **(로그인 필요)** | `Redirect` |
