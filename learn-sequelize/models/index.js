const Sequelize = require('sequelize');

// 개발 환경
// 배포할 땐 process.env.NODE_ENV를 production으로 설정
// 기본적으로 development이다. 
// config.json에 저장된 데이터베이스 설정 사용버전(개발, 테스트, 배포)을 결정
const env = process.env.NODE_ENV || 'development';

// config/config.json에서 데이터베이스 설정 불러오기
const config = require('../config/config')[env];
const db = {};

// MySQL 연결 객체 생성
const sequelize = new Sequelize(config.database, config.username, config.password, config);
// 연결 객체를 나중에 다시 사용하기 위해 db.sequelize에 넣어둠
db.sequelize = sequelize;

module.exports = db;
