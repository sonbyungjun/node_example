const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');


const parseCookies = (cookie = '') => 
    cookie
      .split(';')
      .map(v => v.split('='))
      .map(([k, ...vs]) => [k, vs.join('=')])
      .reduce((acc, [k, v]) => {
        acc[k.trim()] = decodeURIComponent(v);
        return acc;
      }, {});

const session = {};

const server = http.createServer((req, res) => {
  // console.log('서버 실행');
  // fs.readFile('./server2.html', (err, data) => {
  //   if (err) {
  //     throw err;
  //   }
  //   res.end(data);
  // })
  console.log(req.url, parseCookies(req.headers.cookie));
  const cookies = parseCookies(req.headers.cookie);
  if (req.url.startsWith('/login')) {
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const randomInt = +new Date();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    session[randomInt] = {
      name,
      expires,
    };
    res.writeHead(302, {
      location: '/',
      'Set-Cookie': `session=${randomInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
    });
    res.end();
  } else if (cookies.session && session[cookies.session] && session[cookies.session].expires > new Date()) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`${session[cookies.session].name}님 안녕하세요`);
  } else {
    fs.readFile('./server4.html', (err, data) => {
      res.end(data);
    })
  }
  // res.writeHead(200, { 'Set-Cookie': 'mycookie=test' });
  // res.end('Hello Cookie');
}).listen(8080);

server.on('listening', () => {
  console.log('8080번 포트에서 서버 대기중입니다.')
})

server.on('error', (error) => {
  console.error(error);
})