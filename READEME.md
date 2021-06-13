# Node 2021 - 1학기 과제

### 예시 사이트

[node.aio392.com](http://node.aio392.com)

### github

[github 레포지토리](https://github.com/aio39/node-2021)

## 실행

### dev 환경

- back - npm run dev
- front - npm run dev

### prod 환경

- sudo docker-compose up --build
- sudo docker-compose start

## Backend .env 환경 변수

```
### Express 기본 환경 변수
COOKIE_SECRET=cookie
PORT=3005

### Mysql DB dev
MYSQL_DEV_PASSWORD=password
MYSQL_DEV_DB=스키마이름
MYSQL_DEV_HOST=example.com
MYSQL_DEV_PORT=3306

### Mysql DB Prodution
MYSQL_PROD_PASSWORD=password
MYSQL_PROD_DB=스키마이름
MYSQL_PROD_HOST=example.com
MYSQL_PROD_PORT=3306

### Host
APPLICATION_URL=CORS설정

### For Redis
REDIS_PORT=PORT
REDIS_HOST=REDIS_HOST
REDIS_PASSWORD=REDIS_PASSWORD


### For multer-S3
AWS_ID=ID
AWS_SECRET=SECERT_KEY
```

## Frontend .env 환경변수

```
// axios의 base_url 주소입니다.
PROD_HOST=http://example.com/api
DEV_HOST=http://localhost:PORT/api
```
