const url = require('url');
const querystring = require('querystring');

const parsedUrl = url.parse('https://www.gilbut.co.kr/search?keyword=node&tab=total&page=1&code=00000000&idx=&term=&filter=es3&edate=&order=&descending=true&research=&book_tab_cnt=17&data_tab_cnt=0&typo=');
const query = querystring.parse(parsedUrl);

console.log('querystring.parse():', query);
console.log('querystring.stringify()', querystring.stringify(query));