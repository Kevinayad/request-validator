const mqtt = require("mqtt");
const topics = require("./topics");
const validatorTopic = topics.validatorTopic;
const handlerTopic = topics.bookingHandlerTopic;
const host = "ws://broker.emqx.io:8083/mqtt"

var clientId =
  "mqttjs_" +
  Math.random()
    .toString(16)
    .substr(3, 8);

const options = {
    keepalive: 60,
	protocolId: 'MQTT',
	protocolVersion: 4,
    clientId: clientId,
    username: 'test',
    password: '12',
	clean: true,
	reconnectPeriod: 1000,
	connectTimeout: 30 * 1000,
	will: {
		topic: 'WillMsg12',
		payload: 'request-validator failure',
		qos: 1,
		retain: false
	},
}

const client = mqtt.connect(host, options);

function publish(topic, message) {
    client.publish(topic, message, { qos: 1, retain:false });
}

client.on("connect", function() {
    
    console.log("Connecting mqtt client");
    function subscribe(topic) {
        client.subscribe(topic);
        console.log("Subscribed to: " + topic, { qos: 2 });
    }
    subscribe(handlerTopic);
})

client.on('message', function(topic, message) {
    if (topic == handlerTopic){
        //TODO: check for availability before next line is executed
        //send appointment to backend for persisting data
        checkAppointment();
        publish(validatorTopic, message, { qos: 1, retain:false });
    }
    console.log(JSON.parse(message));
})
async function checkAppointment(appointment) {
        var clinicID = appointment.dentistid;
        var date = new Date(appointment.date);
        var day = date.getDay();
        var time = appointment.time;
        var hours = time.slice(0,2);
        var minutes = time.slice(3,5);
        date.setHours(hours,minutes,0);
        date.setTime(date.getTime() + (1*60*60*1000));
        var check = false;
        var clinicName = 'Clinic' + (clinicID);
        var result = await scheduleCollection.findOne({});
        var clinic = result[clinicName];
        const allDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        var daySchedule = clinic[allDays[day]];
        var slot = daySchedule[time];
        var slotTime = slot.time;
        if (date.getTime() == slotTime.getTime() && slot.av == true) {
            slot.av = false;
            await scheduleCollection.deleteOne({}, function (err, res) {
                if (err) {throw err};
                console.log('First schedule removed');
            });
            await scheduleCollection.insertOne(result, function (err, res) {
                if (err) {throw err};
                console.log('Second schedule added');
            });
            check = true;
        }
        if (check) {
            return 1;
        } else {
            return -1;
        }
    }