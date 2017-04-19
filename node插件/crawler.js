var http = require('http') ;
var cheerio = require('cheerio') ;
var url = 'http://sports.sina.com.cn/global/' ;

function filter(html){
	var $ = cheerio.load(html) ;
	var choosenArr = $('li') ;//需要将类名换成具体环境中的类名
	var dataArr = [] ;
	choosenArr.each(function(item){
		var self = $(this) ;
		var title = self.text() ;
		dataArr.push({ title : title }) ;
	}) ;
	return dataArr ;
}

http.get( url , function(res){
	var html = '' ;
	res.on('data' , function(data){
		html += data ;
	}) ;
	res.on('end' , function(){
		var data = filter(html) ;
		data.forEach(function(item){
			console.log('title is :' , item.title ) ;
		}) ;
		//console.log(html) ;
	}) ;
}).on('error' , function(){
	console.log("获取数据出错") ;
}) ;