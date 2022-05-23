const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');

dotenv.config();
const app = express();
// app.set을 하면 app.js 어디서든지 app.get으로 port를 가져올 수 있음
// 전역변수와 비슷한 느낌
app.set('port', process.env.PORT||3000);
// html을 njk로 바꾸면 해당 파일이 넌적스 파일임을 명시할 수 있고 njk 확장자 사용가능.
app.set('view engine', 'html');

nunjucks.configure('views', {
	express: app,
	// html 파일이 변경될 때 템플릿 엔진 다시 렌더링
	watch: true,
});


app.use(morgan('combined'));
// 절대경로 사용
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET,
	cookie: {
		httpOnly: true,
		secure: false,
	},
	name: 'session-cookie',
}));

const multer = require('multer');
const fs = require('fs');

try {
	fs.readdirSync('uploads');
} catch (error) {
	console.error('uploads 폴더가 없어서 uploads 폴더를 생성합니다.');
	fs.mkdirSync('uploads');
}

const uploads = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, 'uploads/');
		},
		filename(req, file, done) {
			const ext = path.extname(file.originalname);
			done(null, path.basename(file.originalname, ext) + Date.now(), + ext);
		},
	}),
	limits: { fileSize: 5 * 1024 * 1024 },
});
app.get('/upload', (req, res) => {
	res.sendFile(path.join(__dirname, 'multipart.html'));
});
app.post('/upload',
	uploads.fields([{ name: 'image1'}, { name: 'image2' }]),
	(req, res) => {
		console.log(req.file, req.body);
		res.send('ok');
	},
);

app.use((req, res, next)=>{
	console.log('모든 요청에 다 실행됩니다.');
	if(req.session.num === undefined) {
		req.session.num = 1;
	} else {
		req.session.num += 1;
	}
	console.log('서버에', req.session.num, '번 접속 중');
	next();
});
app.get('/', (req, res, next)=>{
	console.log('GET / 요청에서만 실행됩니다.');
	next();
}, (req, res)=>{
	console.log('ERROR');
	throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
});

app.use((err, req, res, next)=>{
	console.error(err);
	res.status(500).send(err.message);
});

app.listen(app.get('port'), ()=>{
	console.log(app.get('port'), '번 포트에서 대기 중');
});