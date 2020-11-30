const host = require('ip').address();

//valor en segundos
const red = 15;
const green = 10;
const yellow = 5;

var colorLight;
let timeLeftR;

const topicLtrafic = 'avenue/light-trafic';
const topicBtrafic = 'avenue/app-pedestrian';

const traficLight = () => {

    let timeLeft;
    timeLeftR = red;
    let timeLeftG = green;
    let timeLeftY = yellow;

    const interval = setInterval(() => {
        if (timeLeftG > 0) {
            timeLeft = timeLeftG--;
            colorLight = "Green";
        } else if (timeLeftY > 0) {
            timeLeft = timeLeftY--;
            colorLight = "Yellow";
        } else if (timeLeftR > 0) {
            timeLeft = timeLeftR--;
            colorLight = "Red";
        } else {
            clearInterval(interval);
            traficLight();
        }

        process.stdout.write('\033c');
        const countDown = `${colorLight}: Time Remaining ${timeLeft}s`;
        console.log(countDown);
        mqttPub(topicLtrafic, countDown, host);
        

        

    }, 1000);
};

const mqttPub = (topic, msg, host) => {

    const mqtt = require('mqtt');
    const client = mqtt.connect(`tcp://${host}:1883`);

    client.on('connect', () => {
        client.subscribe(topic, (err) => {
            if (!err) {
                client.publish(topic, msg);
            }
        });
    });

    client.on('message', (topic, message) => {
        console.log("Was send successfully.");
        client.end();
    });
    
}

 const mqttSub = (topic, host) => {
    const mqtt = require('mqtt');
    const client = mqtt.connect(`tcp://${host}:1883`);

    client.on('message', (topic, message) => {

        if(colorLight === "Red" && message == "true" && timeLeftR <= 15) {
            if(timeLeftR < 10 && timeLeftR > 5) timeLeftR += 15;
            else timeLeftR += 10;

        }           
        
        console.log(`Message from ${topic}: ${message}`);
        
    });

    client.on('connect', () => {
        client.subscribe(topic);
    });

}

traficLight();
mqttSub(topicBtrafic, host);