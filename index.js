const mqttPub = () => require('./publish');
const mqttSub = () => require('./subscribe');
const host = require('ip').address();

//valor en segundos
const red = 15;
const green = 10;
const yellow = 5;

var timeLeft;
var colorLight;

const topicLtrafic = 'avenue/light-trafic';
const topicBtrafic = 'avenue/app-pedestrian';

const traficLight = () => {

    let timeLeftR = red;
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
        const countDown = `${colorLight}: Time Remaining ${timeLeft}`;
        console.log(countDown);
        mqttPub(topicLtrafic, countDown, host);
        //mqttSub(topicBtrafic, host);

    }, 1000);
};

traficLight();