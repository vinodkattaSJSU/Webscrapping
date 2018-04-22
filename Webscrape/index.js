var request=require("request");
var cheerio=require("cheerio");
var mongo=require("./mongoConnPool");
var items=[];
console.log("Scrapping webdata");
for(i=0;i<26;i+=25){
var url="https://ndb.nal.usda.gov/ndb/search/list?maxsteps=6&format=&count=&max=25&sort=fd_s&fgcd=&manu=&lfacet=&qlookup=&ds=&qt=&qp=&qa=&qn=&q=&ing=&offset="+i+"&order=asc";
console.log(url);
request('http://www.google.com', function (error, response, body) {
    console.log("why?");
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
request(url,function(error,response,body){
    console.log("Just entered loop");
    if(!error){
        var $=cheerio.load(body);
        var tableEntries=$("tbody").children();
        console.log("In scrapping loop");
        tableEntries.each(function(index){
            var entry=[{
                id:$("tbody").children().eq(index).children().eq(2).find("a").text(),
                name:$("tbody").children().eq(index).children().eq(3).find("a").text(),
                brand:$("tbody").children().eq(index).children().eq(4).find("a").text()
            }];
            console.log(entry.name);
           items.push(entry); 
           console.log(items.findIndex(0));
        });

    }
})}
mongo.insertMany('foodEntries',JSON.parse(items),function(err,result){
    if (result.insertedCount>0) {

        console.log("Scrapped and added data to mongo");
        
        res.code = "201";
        res.value = "Scrapped and added data to mongo";
    } else {
        //res.status(400);
        console.log("no Scrapped and added data to mongo");
        res.code = "400";
        res.value = "no Scrapped and added data to mongo";
    }
    console.log("1: "+res.code);
});

