const Koa = require('koa');
const logger = require('koa-logger');
const convert = require('koa-convert');
const cross = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');

const app = new Koa();

const router = require('./app/router');


app
  .use(bodyParser())
  .use(cors({
      origin: function (ctx) {
        return '*';
      },
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 5,
      credentials: true,
      allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'socketName'],
    }
  ))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(logger())

module.exports = app;
