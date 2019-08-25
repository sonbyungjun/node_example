const http = require('http');
const https = require('https');
const http2 = require('http2');

http.createServer((req, res) => {
  res.end('http server')
}).listen(80)

https.createServer({
  cert: fs.readFileSync('도메인 인증서 경로'),
  key: fs.readFileSync('도메인 비밀키 경로'),
  ca: [
    fs.readFileSync('상위 인증서 경로'),
    fs.readFileSync('상위 인증서 경로'),
    fs.readFileSync('상위 인증서 경로'),
    fs.readFileSync('상위 인증서 경로'),
  ]
},(req, res) => {
  res.end('http server')
}).listen(443)