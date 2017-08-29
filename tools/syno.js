
const {promisifyAll} = require('bluebird')
const axios = require('axios')
const level = require('level')
const _ = require('lodash')
const DB = require('level')('./myDB')
const db = promisifyAll(DB)

function getAPIUrl(serverConfig,option){
  let params = option.params
  let name = ''
  if(params.name){
    name = params.name + '/'
  }
  let url = `http://${serverConfig.ip}:${serverConfig.port}/webapi/${name}${option.cgi}.cgi?`
  for(let key in params){
    if(params[key]){
      url = url + key + '=' + params[key] + '&'
    }
  }
  url = url.substring(0, url.length - 1)
  return url
}

async function login(config) {
  let preSid = await getSid();
  const account = 'brpoper'
  const password = '1313113'
  let option = config.homeAPI.login
  option.params = _.assignIn(option.params, {
    account: account,
    passwd: password,
    session: 'DownloadStation',
    format: 'sid'
  })
  const apiUrl = getAPIUrl(config.homeConf, option)
  let result = await axios.get(apiUrl)
  result.data.preSid = preSid
  return result.data
}

async function putSid(sid) {
  try {
    await db.putAsync('sid', sid)
  } catch (err) {
    console.log('put err', err)
  }
}

async function getSid() {
  let sid = null
  try {
    sid = await db.getAsync('sid')
  } catch (err) {
    console.log('get err', err)
  }
  return sid
}

module.exports = {
  db,
  getAPIUrl,
  getSid,
  putSid,
  login
}
