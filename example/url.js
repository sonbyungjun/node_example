const url = require('url');

const URL = url.URL;
const myURL = new URL('https://www.gilbut.co.kr/search?keyword=node&tab=total&page=1&code=00000000&idx=&term=&filter=es3&edate=&order=&descending=true&research=&book_tab_cnt=17&data_tab_cnt=0&typo=')
console.log('new URL():', myURL);
console.log('url.format():', url.format(myURL));
console.log('searchParams:', myURL.searchParams);

console.log('searchParams.getAll():', myURL.searchParams.getAll('keyword'));
console.log('searchParams.get():', myURL.searchParams.get('tab'));
console.log('searchParams.has():', myURL.searchParams.has('page'));

console.log('searchParams.keys():', myURL.searchParams.keys());
console.log('searchParams.values():', myURL.searchParams.values());

myURL.searchParams.append('filter', 'es3');
myURL.searchParams.append('filter', 'es5');
console.log(myURL.searchParams.getAll('filter'));

myURL.searchParams.set('filter', 'es6');
console.log(myURL.searchParams.getAll('filter'));


console.log('-------------------------------------------');
const parsedUrl = url.parse('https://socialclub.co.kr/luv____bin/?pn=5d524dd5ed723e0458dc18e2');
console.log('url.parse():', parsedUrl);