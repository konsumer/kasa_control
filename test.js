/* global describe, it, expect */
const { login, getDevices, passthrough } = require('.')

const { KASA_USER, KASA_PASS } = process.env

if (!KASA_USER || !KASA_PASS) {
  throw new Error('Put your credentials in the environment variables KASA_USER & KASA_PASS.')
}

let devices

// this is the index of the test device, in getDevices
const di = 2

describe('kasa_control', () => {
  describe('login', () => {
    it('should be able to login', async () => {
      const info = await login(KASA_USER, KASA_PASS)
      expect(info.accountId).toBeDefined()
      expect(info.regTime).toBeDefined()
      expect(info.email).toBeDefined()
      expect(info.token).toBeDefined()
      expect(info.terminalUUID).toBeDefined()
    })
  })

  describe('getDevices', () => {
    it('should get a list of devices', async () => {
      devices = await getDevices()
      expect(devices.length).toBeDefined()
    })
  })

  // These aren't really good for unit-tests, as the require working lights setup on your account
  // but they are useful for trying it out
  describe('passthrough', () => {
    it('should be able to get info from the first device on your account', async () => {
      if (!devices.length) {
        return console.error('No devices, skipping')
      }
      const info = await passthrough(devices[di].deviceId, {system: {get_sysinfo: {}}})
      expect(info.system.get_sysinfo.alias).toBeDefined()
    })

    it('should be able to turn off the light', async () => {
      await passthrough(devices[di].deviceId, {
        'smartlife.iot.smartbulb.lightingservice': {
          'transition_light_state': {
            'ignore_default': 1,
            'on_off': 0
          }
        }
      })
    })

    it('should be able to turn on the light', async () => {
      await passthrough(devices[di].deviceId, {
        'smartlife.iot.smartbulb.lightingservice': {
          'transition_light_state': {
            'ignore_default': 1,
            'on_off': 1
          }
        }
      })
    })
  })
})
