const mqtt = require("mqtt");
const topics = require("./topics");
const validatorTopic = topics.validatorTopic;
const handlerTopic = topics.bookingHandlerTopic;
const localHost = 'mqtt://127.0.0.1'; // Local host
const remoteHost = ''; // Remote host

// Change the value of host to the host in use.
const host = localHost;

const port = ':1883';

const options = {
    keepalive: 60,
	protocolId: 'MQTT',
	protocolVersion: 4,
	clean: true,
	reconnectPeriod: 1000,
	connectTimeout: 30 * 1000,
	will: {
		topic: 'WillMsg',
		payload: 'Connection Closed abnormally..!',
		qos: 1,
		retain: false
	},
    hostURL: (host+port)
}

const client = mqtt.connect(options.hostURL, options);

function publish(topic, message) {
    client.publish(topic, message);
}

client.on("connect", function() {
    
    function subscribe(topic) {
        client.subscribe(topic);
        console.log("Subscribed to: " + topic);
    }
    subscribe(handlerTopic);

    publish(validatorTopic, 'Validate this: ...', { qos: 1, retain:false });
})

client.on('message', function(topic, message) {
    if (topic == handlerTopic){
        //TODO: check for availability before next line is executed
        //send appointment to backend for persisting data
        publish(validatorTopic, message, { qos: 1, retain:false });
    }
    console.log(message.toString());
})