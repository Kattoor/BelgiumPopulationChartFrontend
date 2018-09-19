const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    if (req.url === '/')
        res.end(fs.readFileSync('./index.html'));
    if (req.url === '/data-renderer.js')
        res.end(fs.readFileSync('./data-renderer2.js'));
    if (req.url === '/data') {
        const merged = fs.readFileSync('./output.csv');
        res.end(merged);
    } else
        res.end('');
}).listen(8080);
