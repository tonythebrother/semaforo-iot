const host = require('ip').address();

//valor en segundos
const red = 15;
const green = 10;
const yellow = 5;

var pedesLight;
let timeLeftR;

const topicLtrafic = 'avenue/light-trafic';
const topicBtrafic = 'avenue/app-pedestrian';

const traficLight = () => {

    let colorLight;
    let timeLeft;
    timeLeftR = red;
    let timeLeftG = green;
    let timeLeftY = yellow;

    const interval = setInterval(() => {
        if (timeLeftG > 0) {
            timeLeft = timeLeftG--;
            colorLight = "Green";
            pedesLight = "Red";
        } else if (timeLeftY > 0) {
            timeLeft = timeLeftY--;
            colorLight = "Yellow";
        } else if (timeLeftR > 0) {
            timeLeft = timeLeftR--;
            colorLight = "Red";
            pedesLight = "Green";
        } else {
            clearInterval(interval);
            traficLight();
        }

        process.stdout.write('\033c');

        let tLeftp;
        if(pedesLight == "Red") tLeftp = timeLeftG + timeLeftY + 1;
        else tLeftp = timeLeft;

        const countDown = `Trafic\n${colorLight}: Time Remaining ${timeLeft}s \n\nPedestrian \n${pedesLight}: Time Remaining ${tLeftp}s \n`;
        console.log(countDown);

        const data = `${colorLight} - ${timeLeft} - ${pedesLight} - ${tLeftp}`

        mqttPub(topicLtrafic, data, host);      

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
        console.log("Data was send successfully.");
        client.end();
    });
    
}

 const mqttSub = (topic, host) => {
    const mqtt = require('mqtt');
    const client = mqtt.connect(`tcp://${host}:1883`);

    client.on('message', (topic, message) => {

        if(pedesLight === "Green" && message == "true" && timeLeftR <= 15) {
            if(timeLeftR > 5 && timeLeftR <= 10) timeLeftR += 15;
            else timeLeftR += 10;

        }           
        
        console.log(`*Message from ${topic}: ${message}*`);
        
    });

    client.on('connect', () => {
        client.subscribe(topic);
    });

}

traficLight();
mqttSub(topicBtrafic, host);