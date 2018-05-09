const fetch = require('node-fetch')
const uuid4 = require('uuid4')

const headers = { 'content-type': 'application/json' }

module.exports = class KasaControl {
  constructor () {
    this.urlBase = 'https://wap.tplinkcloud.com'
    this.url = this.urlBase
  }

  login (cloudUserName, cloudPassword) {
    this.uuid = uuid4()
    return this.kasa('login', { appType: 'Kasa_Android', cloudUserName, cloudPassword, terminalUUID: this.uuid })
      .then(r => {
        this.url = `${this.urlBase}?token=${r.token}`
        return { ...r, uuid: this.uuid }
      })
  }

  kasa (method, params) {
    if (!this.url) {
      throw new Error('You must login.')
    }
    return fetch(this.url, {method: 'POST', headers, body: JSON.stringify({method, params})})
      .then(r => r.json())
      .then(r => {
        if (r.error_code) { throw new Error(r.msg) }
        return r
      })
      .then(r => r.result)
  }

  passthrough (deviceId, command) {
    return this.kasa('passthrough', {deviceId, requestData: JSON.stringify(command)})
      .then(r => JSON.parse(r.responseData))
  }

  getDevices () {
    return this.kasa('getDeviceList').then(r => r.deviceList)
  }
}
