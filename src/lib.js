const fetch = require('node-fetch')
const uuid4 = require('uuid4')

const headers = { 'content-type': 'application/json' }

class KasaControl {
  constructor () {
    this.urlBase = 'https://wap.tplinkcloud.com'
  }

  /**
   * Login to Kasa
   * @param  {string} cloudUserName Your tplink-cloud email
   * @param  {string} cloudPassword Your tplink-cloud password
   * @return {Promise}              Resolves with some info about your login
   * @example
```js
kasa.login('email', 'password')
  .then(response => {
    console.log(response)
  })
  .catch(e => console.error(e))
```
   */
  login (cloudUserName, cloudPassword) {
    this.uuid = uuid4()
    this.url = this.urlBase
    return this.kasa('login', { appType: 'Kasa_Android', cloudUserName, cloudPassword, terminalUUID: this.uuid })
      .then(r => {
        this.url = `${this.urlBase}?token=${r.token}`
        return { ...r, uuid: this.uuid }
      })
  }

  // internal method for POSTing to Kasa
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

  /**
   * Send a message to a lightbulb (for RAW JS message objects)
   * @module send
   * @param {string} deviceId The deviceId of the device in your kasa app
   * @param  {Object} msg Message to send to bulb
   * @return {Promise}    Resolves with answer
   * @example
```js
kasa.send('80126E22B048C76F341BEED1A3EA8E77177F3484', {
  'smartlife.iot.smartbulb.lightingservice': {
    'transition_light_state': {
      'on_off': 1,
      'transition_period': 0
    }
})
  .then(response => {
    console.log(response)
  })
  .catch(e => console.error(e))
```
   */
  send (deviceId, msg) {
    return this.kasa('passthrough', {deviceId, requestData: JSON.stringify(msg)})
      .then(r => JSON.parse(r.responseData))
  }

  /**
   * Get a list of devices for your Kasa account
   * @module getDevices
   * @return {Promise} Resolves to an array of device-objects
   * @example
```js
kasa.getDevices()
  .then(devices => {
    console.log(devices)
  })
  .catch(e => console.error(e))
```
   */
  getDevices () {
    return this.kasa('getDeviceList').then(r => r.deviceList)
  }

  /**
   * Get info about a device
   * @param  {string} deviceId The deviceId of the device in your kasa app
   * @return {Promise}         Resolves to an info-pbject about your device
   * example
```js
kasa.info('80126E22B048C76F341BEED1A3EA8E77177F3484')
  .then(info => {
    console.log(info)
  })
  .catch(e => console.error(e))
```
   */
  info (deviceId) {
    return this.send(deviceId, {system: {get_sysinfo: {}}})
  }

  /**
   * Set power-state of lightbulb
   * @module power
   * @param  {string} deviceId The deviceId of the device in your kasa app
   * @param {Boolean} powerState On or off
   * @param {Number}  transition Transition to new state in this time
   * @param {Object}  options    Object containing `mode`, `hue`, `saturation`, `color_temp`, `brightness`
   * @returns {Promise}          Resolves to output of command
   * @example
   * ```js
// turn a light on
kasa.power('80126E22B048C76F341BEED1A3EA8E77177F3484', true)
  .then(status => {
    console.log(status)
  })
  .catch(err => console.error(err))
```
   */
  power (deviceId, powerState, transition, options) {
    return this.info(deviceId)
      .then(info => {
        if (typeof info.relay_state !== 'undefined') {
          return this.send(deviceId, {
            system: {
              set_relay_state: {
                state: powerState ? 1 : 0
              }
            }
          })
        } else {
          return this.send(deviceId, {
            'smartlife.iot.smartbulb.lightingservice': {
              'transition_light_state': {
                'ignore_default': 1,
                'on_off': powerState ? 1 : 0,
                'transition_period': transition,
                ...options
              }
            }
          })
          .then(r => r['smartlife.iot.smartbulb.lightingservice']['transition_light_state'])
        }
      })
  }
}

module.exports = KasaControl
