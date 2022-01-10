const database= require("./database.js");
const broker= require("./broker/broker.js")
async function checkAppointment(appointment) {
    var schedule;
    var res = await database.showSchedule(schedule);
    var clinicID = appointment.dentistid;
    var date = new Date(appointment.date);
    var day = date.getDay()
     var hours = addZero(date.getHours());
     var minutes = addZero(date.getMinutes());
     var time = hours+":"+minutes;
     console.log(time);
     date.setTime(date.getTime() + (1*60*60*1000));
    var check = false;
    var clinicName = 'Clinic' + (clinicID);
    var clinic = res[clinicName];
    const allDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var daySchedule = clinic[allDays[day]];
    var slot = daySchedule[time];
    var slotTime = slot.time;
    if (date.getTime() == slotTime.getTime() && slot.av == true) {
        check = true;
        
    }
    if (check) {
        var test= JSON.stringify(appointment);
        broker.publish(broker.validatorTopic,test);
        console.log(test);
    } else {
        broker.publish(broker.validatorTopic,"false");
    }
}
function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
exports.checkAppointment = checkAppointment;