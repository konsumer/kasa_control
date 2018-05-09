# kasa-control

This will let you use kasa-cloud to hit your TPLink bulbs in nodejs.

If you'd like to hit them directly, on your local network, use [tplink-lightbulb](https://github.com/konsumer/tplink-lightbulb). This library is for situations where you want to use a username/password (from [tplink cloud](https://www.tplinkcloud.com/).) It will allow you to acces them remotely.

## installation

```sh
npm i kasa_control
```

### example usage

```js
const KasaControl = require('kasa_control')
const kasa = new KasaControl()

const async main = () => {
  await kasa.login('email', 'password')
  const devices = await kasa.getDevices()

  // turn off first device
  await kasa.power(devices[0].deviceId, false)
}
main()

```

## api

<dl>
<dt><a href="#module_send">send</a> ⇒ <code>Promise</code></dt>
<dd><p>Send a message to a lightbulb (for RAW JS message objects)</p>
</dd>
<dt><a href="#module_getDevices">getDevices</a> ⇒ <code>Promise</code></dt>
<dd><p>Get a list of devices for your Kasa account</p>
</dd>
<dt><a href="#module_info">info</a> ⇒ <code>Promise</code></dt>
<dd><p>Get info about a device</p>
</dd>
<dt><a href="#module_power">power</a> ⇒ <code>Promise</code></dt>
<dd><p>Set power-state of lightbulb</p>
</dd>
</dl>

<a name="module_send"></a>

## send ⇒ <code>Promise</code>
Send a message to a lightbulb (for RAW JS message objects)

**Returns**: <code>Promise</code> - Resolves with answer

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> | The deviceId of the device in your kasa app |
| msg | <code>Object</code> | Message to send to bulb |

**Example**
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
<a name="module_getDevices"></a>

## getDevices ⇒ <code>Promise</code>
Get a list of devices for your Kasa account

**Returns**: <code>Promise</code> - Resolves to an array of device-objects
**Example**
```js
kasa.getDevices()
  .then(devices => {
    console.log(devices)
  })
  .catch(e => console.error(e))
```
<a name="module_info"></a>

## info ⇒ <code>Promise</code>
Get info about a device

**Returns**: <code>Promise</code> - Resolves to an info-pbject about your device
example
```js
kasa.info('80126E22B048C76F341BEED1A3EA8E77177F3484')
  .then(info => {
    console.log(info)
  })
  .catch(e => console.error(e))
```

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> | The deviceId of the device in your kasa app |

<a name="module_power"></a>

## power ⇒ <code>Promise</code>
Set power-state of lightbulb

**Returns**: <code>Promise</code> - Resolves to output of command

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> | The deviceId of the device in your kasa app |
| powerState | <code>Boolean</code> | On or off |
| transition | <code>Number</code> | Transition to new state in this time |
| options | <code>Object</code> | Object containing `mode`, `hue`, `saturation`, `color_temp`, `brightness` |

**Example**
```js
// turn a light on
kasa.power('80126E22B048C76F341BEED1A3EA8E77177F3484', true)
  .then(status => {
    console.log(status)
  })
  .catch(err => console.error(err))
```

## thanks

Thanks to itnerd for these 3 articles:

* [authenticate](http://itnerd.space/2017/06/19/how-to-authenticate-to-tp-link-cloud-api/)
* [deviceList](http://itnerd.space/2017/05/21/how-to-get-the-tp-link-hs100-cloud-end-point-url/)
* [passthrough](http://itnerd.space/2017/01/22/how-to-control-your-tp-link-hs100-smartplug-from-internet/)