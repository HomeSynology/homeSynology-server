const Router = require('koa-router')
const router = new Router()
const axios = require('axios')
const fs = require('fs')
const _ = require('lodash')
const getConnSocket = require('./socket')
const multer = require('koa-multer')
const parseTorrent = require('parse-torrent')
const {DownloadStation} = require('synoapi')
const PassThrough = require('stream').PassThrough;
const config = require('../config')

const ds = new DownloadStation(config)

async function getEmit(emit, on) {
  try {
    const socket = getConnSocket(emit.synoKey)
    return new Promise(function (resolve, reject) {
      socket.on(on, function (data) {
        resolve(data)
      })
      socket.emit(emit.emit, emit.data)
    })
  } catch (err) {
    console.log(err)
  }
}

router.options('*', function (ctx, next) {
  ctx.response.status = 200
  next()
})
router.get('*', async function (ctx, next) {
  const request = ctx.request
  console.log('request', request)

  const result = await getEmit({
    emit: 'getapi',
    data: request,
    synoKey: ctx.query.synoKey
    // synoKey: 'brpoper'
  }, 'getapiback')
  ctx.body = result
})


const upload = multer({dest: 'uploads/'})
const type = upload.single('file')
router.post('/creatTorrent', type, async function (ctx, next) {
  const file = ctx.req.file
  const fields = ctx.req.body
  console.log('fileds', fields)
  console.log('file', file)
  console.log(fields)
  const torrent = parseTorrent(fs.readFileSync(file.path))
  const magnetURI = parseTorrent.toMagnetURI(torrent)
  const options = {
    cgi: 'task',
    name: 'DownloadStation',
    api: 'SYNO.DownloadStation.Task',
    version: 1,
    method: 'create'
  }
  const requestUrl = await ds.getAPIUrl(_.assignIn(options, {
    destination: fields.destination || '',
    uri: magnetURI,
    _sid: fields._sid,
  }), true)
  const result = await getEmit({
    emit: 'getapi',
    data: {url: requestUrl},
    synoKey: fields.synoKey
  }, 'getapiback')
  console.log('createTorrent url emit', result)


  const body = _.assignIn(file, {infoHash: torrent.infoHash, magnetURI: magnetURI})
  fs.unlink(file.path, () => {
    console.log('已删除', file.originalname)
  })
  ctx.body = body
})


function isBlob(obj) {
  return typeof Blob !== 'undefined' && obj instanceof Blob
}

module.exports = router

