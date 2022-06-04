const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
// 
// require('./models')는 require('./models/index.js')와 같음
// 시퀄라이즈 연결 객체(db.sequelize) 가져오기
const { sequelize } = require('./models');
const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');

const app = express();
// 포트 설정
app.set('port', process.env.PORT || 3001);
// view engine 설정(넌적스)
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

// 서버 실행 시 노드와 MySQL 연동되도록 설정
// force: true이면 서버 실행 시마다 테이블 재생성
// 테이블 잘못 만든 경우에 사용
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });
// test
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
