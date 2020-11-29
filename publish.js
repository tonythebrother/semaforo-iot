module.exports.mqttPub = (top, msg, host) => {

    console.log("klk")

    const mqtt = require('mqtt');
    const client = mqtt.connect(`tcp://${host}:1883`);

    client.on('connect', () => {
        client.subscribe(topic, (err) => {
            if (!err) {
                client.publish(top, msg);
            }
        });
    });

    client.on('message', (topic, message) => {
        console.log("Was send successfully.");
        client.end();
    });

    


}