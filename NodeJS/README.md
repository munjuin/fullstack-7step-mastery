# Node.js 풀스택 게시판 (이미지 업로드 & 실시간 채팅 포함)

Node.js, Express, MongoDB를 기반으로 **CRUD, 인증, 이미지 업로드(AWS S3), 실시간 채팅(Socket.io)** 기능을 모두 구현한 풀스택 웹 애플리케이션입니다.

---

## 사용된 기술 스택

### Backend

- **Node.js** & **Express**: 웹 서버 프레임워크
- **MongoDB** & **Mongoose**: NoSQL 데이터베이스 및 ODM
- **Passport.js**: 회원가입 및 로그인 인증 (Local Strategy)
- **Socket.io**: 실시간 양방향 통신 (채팅)

### Infrastructure & Storage

- **AWS S3**: 이미지 파일 클라우드 저장소
- **Multer** & **Multer-S3**: 파일 업로드 미들웨어

### Frontend

- **EJS**: 템플릿 엔진 (Server-Side Rendering)
- **jQuery**: AJAX 요청 및 DOM 조작

---

## 설치 및 실행 방법

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

````text
    PORT=8080
    DB_URL=mongodb+srv://<아이디>:<비번>@... (MongoDB 접속 주소)
    SESSION_SECRET=your_secret_key

    # AWS S3 설정 (이미지 업로드용)
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret_key
    AWS_REGION=ap-northeast-2
    BUCKET_NAME=your_bucket_name
    ```

---

## 실행 방법

```bash
npm start

````

# API 명세서

### 1. 회원 인증 (Auth)

| Method | Endpoint    | 설명                          |
| :----- | :---------- | :---------------------------- |
| POST   | `/login`    | Passport를 이용한 로그인 처리 |
| POST   | `/register` | 회원가입 처리                 |
| GET    | `/logout`   | 세션 종료 및 로그아웃         |

### 2. 게시판 (Board) & 이미지 (Image)

| Method | Endpoint      | 설명                                                    |
| :----- | :------------ | :------------------------------------------------------ |
| GET    | `/list`       | 전체 게시물 목록 조회                                   |
| GET    | `/detail/:id` | 게시물 상세 조회 (이미지 포함)                          |
| POST   | `/add`        | **(Multipart)** 게시물 작성 및 **AWS S3 이미지 업로드** |
| DELETE | `/delete`     | 게시물 삭제 (작성자 본인만 가능)                        |
| PUT    | `/edit`       | 게시물 수정                                             |

### 3. 실시간 채팅 (Chat)

- **기술:** WebSocket (Socket.io)
- **기능:**
  - 유저 간 실시간 메시지 전송 (Broadcasting)
  - 채팅방 입장/퇴장 시스템 알림
  - 보낸 사람 닉네임 표시

### 4. 기타 기능

- **이미지 제한:** 5MB 이상의 파일 업로드 제한 (Multer 설정)
- **보안:** 로그인한 유저만 글 작성/수정/삭제 가능 (Middleware 적용)
