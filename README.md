# kasa-control

This will let you use kasa-cloud to hit your TPLink bulbs in nodejs.

If you'd like to hit them directly, on your local network, use [tplink-lightbulb](https://github.com/konsumer/tplink-lightbulb). This library is for situations where you want to use a username/password (from [tplink cloud](https://www.tplinkcloud.com/).) It will allow you to acces them remotely.

## installation

```sh
npm i kasa_control
```

## api

Right now, it only has `login`, `getDevices`, `passthrough`, but eventually I will add all the stuff in [tplink-lightbulb](https://github.com/konsumer/tplink-lightbulb), via passthroughs.


### example usage

```js
const KasaControl = require('kasa_control')
const kasa = new KasaControl()

const async main = () => {
  await kasa.login('email', 'password')
  const devices = await kasa.getDevices()

  // turn off first device
  await kasa.passthrough(devices[0].deviceId, {
    'smartlife.iot.smartbulb.lightingservice': {
      'transition_light_state': {
        'ignore_default': 1,
        'on_off': 0
      }
    }
  })
}
main()

```

## thanks

Thanks to itnerd for these 3 articles:

* [authenticate](http://itnerd.space/2017/06/19/how-to-authenticate-to-tp-link-cloud-api/)
* [deviceList](http://itnerd.space/2017/05/21/how-to-get-the-tp-link-hs100-cloud-end-point-url/)
* [passthrough](http://itnerd.space/2017/01/22/how-to-control-your-tp-link-hs100-smartplug-from-internet/)