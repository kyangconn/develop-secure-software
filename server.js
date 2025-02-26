const http = require('http');
const {URL} = require(`url`);

function start(route) {
    function onRequest(req, res) {
        // use URL to solve request path
        const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
        console.log(`Request for ${pathname}`);

        route(pathname);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end();
    }

    // create server at port 3000
    http.createServer(onRequest).listen(3000);
    console.log('Server start at port 3000');
}

module.exports = {start};