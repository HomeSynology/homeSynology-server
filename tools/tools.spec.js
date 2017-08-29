const Server = require('./syno')
const {expect} = require('chai')

describe('tools', () => {
  it('get api url without api name', () => {

    const config = {ip: '192.168.3.133', port: 5000}
    const option = {
      cgi: 'auth',
      params: {
        api: 'SYNO.API.Auth',
        method: 'login',
        version: 2,
        account: 'brpoper',
        passwd: '1313113',
        session: 'DownloadStation',
        format: 'sid'
      }
    }

    const result = Server.getAPIUrl(config, option)

    let webapiIndex = result.indexOf('webapi')
    let cgiIndex = result.indexOf('.cgi?')

    expect(result.substring(webapiIndex+'webapi/'.length,cgiIndex)).not.contains('/')
    expect(result)
      .to.contains('auth.cgi?api=SYNO.API.Auth')
      .contains('method=login')
      .contains('account=brpoper')

  })

  it('get api url with api name', () => {

    const config = {ip: '192.168.3.133', port: 5000}
    const option = {
      cgi: 'auth',
      params: {
        api: 'SYNO.API.Auth',
        method: 'login',
        name: 'DownloadStation',
        version: 2,
        account: 'brpoper',
        passwd: '1313113',
        session: 'DownloadStation',
        format: 'sid'
      }
    }

    const result = Server.getAPIUrl(config, option)

    console.log(result)
    expect(result)
      .to.contains('auth.cgi?api=SYNO.API.Auth')
      .contains('method=login')
      .contains('account=brpoper')
      .contains('/DownloadStation/')

  })

})
