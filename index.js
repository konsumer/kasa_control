const fetch = require('node-fetch')
const uuid4 = require('uuid4')

const headers = { 'content-type': 'application/json' }
const urlBase = 'https://wap.tplinkcloud.com'
let url = urlBase

// run a kasa command
const kasa = (method, params) => fetch(url, {method: 'POST', headers, body: JSON.stringify({method, params})})
  .then(r => r.json())
  .then(r => {
    if (r.error_code) { throw new Error(r.msg) }
    return r
  })
  .then(r => r.result)

// login to kasa
const login = (cloudUserName, cloudPassword) => {
  const terminalUUID = uuid4()
  return kasa('login', { appType: 'Kasa_Android', cloudUserName, cloudPassword, terminalUUID })
  .then(r => {
    url = `${urlBase}?token=${r.token}`
    return { ...r, terminalUUID }
  })
}

// pass a command to a device that you have the ID for
const passthrough = (deviceId, command) => kasa('passthrough', {deviceId, requestData: JSON.stringify(command)}).then(r => JSON.parse(r.responseData))

// get a list of devices
const getDevices = () => kasa('getDeviceList').then(r => r.deviceList)

module.exports = {
  kasa,
  login,
  passthrough,
  getDevices
}
