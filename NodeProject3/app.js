/**
 * 0804
 */


// ========================================================
// require불러오기
// ========================================================
const express = require('express'); //불러온 객체가 새로운게되면안디잖!
const errorHandler = require('express-error-handler');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const multer  = require('multer');
//multer 스토리지만들자
var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './uploads');
	  },
	  filename: function (req, file, cb) {
		  // --------- 쩔지? ------------------
		  // 이걸 라이브러리화나 (수듄ㅎ 따라 다르죠?)
		  // 함수루다가 바꿔봐도좋겠지?
		  var fname = file.originalname;
		  var idx = fname.lastIndexOf('.');
		  var fa = fname.substring(0, idx); //마지막 .으루다가
		  var fb = fname.substring(idx);//substrimg으루 나누자
		  fname = fa + Date.now() + fb;
		  // ----------------------------------
		  
		  //여기서 중복여부 검사하면...으어ㅓ,,,아어ㅓㅇ..
		  
		  // ----------------------------------
		  
//	    cb(null, file.originalname); //동음이의파일이면 망함주의
	    cb(null, fa + Date.now() + fb);
	  }
	});
var upload = multer({ storage: storage }); //요걸이용하겠다
var cpUpload = upload.fields([{name: 'ufile1', maxCount: 1},
                {name: 'ufile2', maxCount: 1}]);
// ========================================================
// 미들웨어들
// ========================================================

//정적인것들로 인식하고 글케 줄게~
app.use(express.static(path.join(__dirname, 'public')));
//나머지는 니가(욕아님ㅎ) 알아서 하시오~

app.use(bodyParser.json());

//========================================================
/// 라우팅
//========================================================
app.get('/', function (req, res) {  //root
  res.send('Worlo Helld!!' + req.aaa.name); //서벗단 에라
});

/// after lunch
//app.get('/form', function(req, res){
//	var name = req.query.name;
//	var age = req.query.age;
//	res.send('name: ' + name + ',  age: ' + age);
//});
////sequal url처리! 
//app.get('/form/:name/:age', function(req, res){
//	var name = req.params.name;
//	var age = req.params.age;
//	res.send('name: ' + name + ',  age: ' + age);
//});

//라우터가 유사하다면 그냥 query string, semantic url둘다할꺼야!
//(걸어야될 내부적 function이 똑같다면)
app.get(['/form', '/form/:name/:age'], function(req, res){
	var name = req.query.name || req.params.name;
	var age = req.query.age || req.params.age;
	res.send('name: ' + name + ',  age: ' + age);
});

//post방식
//==-==============================-=================-=====
//멀티파일 //ufile1, 2루다가 했을때
app.post('/form', cpUpload, function(req, res){
	var name = req.body.name;
	var age = req.body.age;
	console.log(req.files); //파일만일로드루와
	res.send('form post // name: ' + name + ',  age: ' + age);
});

//멀티파일	//얘는 ufile둘다같은일므일때 
//app.post('/form', upload.array('ufile', 2), function(req, res){
//	var name = req.body.name;
//	var age = req.body.age;
//	console.log(req.files); //파일만일로드루와
//	res.send('form post // name: ' + name + ',  age: ' + age);
//});

// 얘는 싱글파일
//app.post('/form', upload.single('ufile'), function(req, res){
//	var name = req.body.name;
//	var age = req.body.age;
//	console.log(req.file); //파일만일로드루와
//	res.send('form post // name: ' + name + ',  age: ' + age);
//});

//app.post('/form', function(req, res){
//	var name = req.body.name;
//	var age = req.body.age;
//	res.send('form post // name: ' + name + ',  age: ' + age);
//});

//==================================================
// 클라이언트 (400) / 서버(500) 오류 처리
//==================================================
//서버 500번대 에러는 여기서 404보다 먼저해야돼
app.use(function(err, req, res, next){
	console.log(err);
//	next(err);
//	res.status(500);	//이거 쓰지말구 그냥 200보내게 냅둬
			//운영자는 클라든 서버오류는 404 500 띄우지않고
			//잘 가공처리해서 보내줘야되는것이다
	res.send('서버가 바빠요 1');
});
//==================================================


var handler = errorHandler({
	static : {
		'404' : '/public/e1.html'
	}
});

//Pass a 404 into next(err) 
app.use( errorHandler.httpError(404) );
 
// Handle all unhandled errors: 
app.use( handler );


app.listen(3000, function () {
	console.log('Example app listening on port 3000!!');
});