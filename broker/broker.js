const mqtt = require("mqtt");
const topics = require("./topics");
const vald = require("../appointment.js");
const { measureMemory } = require("vm");
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
function subscribe(topic) {
    client.subscribe(topic);
    console.log("Subscribed to: " + topic, { qos: 2 });
}
var dummy={
    "userid": 12345,
    "requestid": 13,
    "dentistid": 1,
    "issuance": 1602406766314,
    "date": "2022-01-03",
    "time": "12:30"
  }
client.on("connect", function() {
    
    console.log("Connecting mqtt client");
    subscribe(handlerTopic);
   var dum= JSON.stringify(dummy);
    publish(handlerTopic,dum);
})

client.on('message', function(topic, message) {
    if (topic == handlerTopic){
        //TODO: check for availability before next line is executed
        //send appointment to backend for persisting data
        var mes=JSON.parse(message);
        vald.checkAppointment(mes);
        // publish(validatorTopic, message, { qos: 1, retain:false });
    }
   // console.log(JSON.parse(message));
})
exports.publish=publish;
exports.validatorTopic=validatorTopic;