switch (process.env.NODE_ENV) {
    case 'prod':
    case 'production':
        module.exports = require('./config/webpack.prod.config')({env: 'production'});
        break;
    case 'test':
    case 'testing':
        module.exports = require('./config/webpack.test.config')({env: 'testing'});
        break;
    case 'dev':
    case 'development':
    default:
        module.exports = require('./config/webpack.dev.config')({env: 'development'});
}