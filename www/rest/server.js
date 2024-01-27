const http = require('http');

const startServer = (app) => {
    const server = http.createServer(app);

    // Set timeout to 2 hours (in milliseconds)
    server.timeout = 2 * 60 * 60 * 1000; // 2 hours

    server.listen(process.env.REST_PORT);

    server.on('listening', () => {
        console.log(`Server listening on port: ${server.address().port}`);
    });

    server.on('error', (err) => {
        console.log(`Error: ${err}`);
    });
}

module.exports = {
    startServer: startServer
}
