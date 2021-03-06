module.exports = {
    DBPATH: process.env.MONGODB_URI || 'mongodb://localhost:27017/agate-db',
    PORT_EXPRESS : process.env.PORT || 2666,
    JWT_SECRET: process.env.JWT_SECRET || 'growing-habit',
    ALLOWED_ORIGINS :['http://localhost', 'https://localhost', 'https://pages.github.com' , 'https://github.com'],
    REGEX : {
        USERNAME : /^(?=.{4,20}$)[A-Za-z0-9]+(?:[_.][A-Za-z0-9]+)*$/, // 4-20, a-zA-Z0-9._, no._start or end, no consecutive ._
        PW : /.*[A-Za-z0-9]{4,20}$/   
    },
    ACCESSIBLE : [
        /\/static\/.*$/,
        '/',
        '/index.html',
        '/favicon.ico',
        '/app',
        '/login',
        /^\/habits([^\/]*)$/, 
        '/service-worker.js',
        {url: '/users', methods: 'POST'}
    ]
};