/*
* 写一个node爬虫
* */
//爬取数据的目标网址
let url = 'http://sports.sina.com.cn/nba/1.shtml';
let cheerio = require('cheerio');
//引入标准http库
let http = require('http');
let fs = require("fs");

// 向网络发起get请求，请求网络资源
http.get(url, (res)=>{
    //程序发起网络请求后，回调函数立即执行 res后端返回并解析的http报文
    let html = '';

    res.on('data',(chuck)=>{
        //chuck 块，
        //有一段流被接受到后，执行回调函数
        //把每一段流都拼接起来
        html += chuck;
    });

    res.on('end',()=>{
        //监听所有信息传输完毕后，执行回调函数
        //打印出来其实就是目标url的页面源代码
        // console.log(html);
        // console.log(cheerio1);
        let $ = cheerio.load(html);
        //根据源代码找到我们想要的数据的DOM,并遍历
        $('#right a').each(function(){
            //获取a标签的href属性
            let articleUrl = $(this).attr('href');
            console.log(articleUrl);

            http.get(articleUrl,(res)=>{
                let html = "";
                res.on("data",(chuck)=>{
                    html += chuck;
                });

                res.on('end',()=>{
                    // console.log(html);
                    let $ = cheerio.load(html);//解析DOM字符串
                    var oText = $('#artibody').text();
                    console.log(oText);
                    //时间戳来作为文件的唯一标识
                    let time = new Date().valueOf();
                    fs.writeFile(`./news/NBA${time}.txt`,oText);
                });
            }).on("error",function (err) {
                //js是单线程，发生一个错误，会导致整个程序奔溃，需要对错误进行处理
                // console.log(err)
            });
        })
    });
});
