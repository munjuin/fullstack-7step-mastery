# my-first-nodejs-server

Node.js, Express, MongoDB를 사용해 만든 간단한 게시물 조회 서버입니다.

---

## 사용된 기술 스택

- Node.js
- Express
- MongoDB (Mongoose)
- EJS (Embedded JavaScript templates)
- dotenv

---

## 설치 방법

1.  레포지토리를 클론합니다.
    ```bash
    git clone https://github.com/munjuin/fullstack-7step-mastery.git
    ```
2.  프로젝트 디렉토리로 이동합니다.
    ```bash
    cd NodeJS
    ```
3.  필요한 패키지를 설치합니다.
    ```bash
    npm install
    ```
4.  `.env` 파일을 루트 디렉토리에 생성하고 필요한 환경 변수를 설정합니다.

---

## 실행 방법

```bash
npm start
```

# API 명세서

## 1. 페이지 및 정적 파일 라우팅

서버에서 HTML 페이지를 직접 반환하거나 EJS 템플릿을 렌더링하는 엔드포인트입니다.

| Method | Endpoint | 주요 기능                               | 응답 형식    |
| :----- | :------- | :-------------------------------------- | :----------- |
| `GET`  | `/`      | 메인 페이지(`index.html`)를 반환합니다. | `text/html`  |
| `GET`  | `/about` | 'about.html' 정적 파일을 반환합니다.    | `text/html`  |
| `GET`  | `/shop`  | '쇼핑페이지입니다' 텍스트를 응답합니다. | `text/plain` |

---

## 2. 데이터베이스 연동 라우팅 (EJS 렌더링)

데이터베이스에서 정보를 조회하여 EJS 템플릿과 결합해 완전한 HTML 페이지로 렌더링합니다.

| Method | Endpoint  | 주요 기능                                                                                               | 응답 형식   |
| :----- | :-------- | :------------------------------------------------------------------------------------------------------ | :---------- |
| `GET`  | `/time`   | `time.ejs` 템플릿에 현재 날짜(`new Date()`)를 전달하여 렌더링합니다.                                    | `text/html` |
| `GET`  | `/list`   | **`post`** 컬렉션의 모든 문서를 조회하여 `list.ejs` 템플릿에 `posts` 변수로 전달 후 렌더링합니다.       | `text/html` |
| `GET`  | `/notice` | **`notice`** 컬렉션의 모든 문서를 조회하여 `notice.ejs` 템플릿에 `notices` 변수로 전달 후 렌더링합니다. | `text/html` |
