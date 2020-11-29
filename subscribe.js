module.exports.mqttSub = (topic, host) => {
    const mqtt = require('mqtt');
    const client = mqtt.connect(`tcp://${host}:1883`);

    client.on('message', (topic, message) => {
        console.log(`Message from ${topic}: ${message}`);
        client.end();
    });

    client.on('connect', () => {
        client.subscribe(topic);
    });
}