const proxy = require('http-proxy-middleware');
module.exports = app => {
    app.use(proxy('/reportesHub', { target: 'http://157.245.236.204:5100/', ws: true }));
}