const mqtt = require('mqtt')
const client  = mqtt.connect('tcp://127.0.0.1:1883')
 
client.on('connect', function () {
  client.subscribe('prueba', function (err) {
    if (!err) {
      client.publish('prueba', 'Hello World')
    }
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
}) 
