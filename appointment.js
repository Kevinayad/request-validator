const database= require("./database.js");
const broker= require("./broker/broker.js")
async function checkAppointment(appointment) {
    var schedule;
    var res = await database.showSchedule(schedule);
    //console.log(res);
    var clinicID = appointment.dentistid;
    var date = new Date(appointment.date);
    //var date = '2022-01-12T07:30:00.000Z';
    var day = date.getDay();
    // var time = appointment.time;
    date.setTime(date.getTime());
     var hours = addZero(date.getHours());
     var minutes = date.getMinutes();
     var time = hours+":"+minutes;
     //console.log(time);
    // date.setHours(hours,minutes,0);
    var check = false;
    var clinicName = 'Clinic' + (clinicID);
    var clinic = res[clinicName];
    const allDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var daySchedule = clinic[allDays[day]];
    //console.log(daySchedule);
    var slot = daySchedule[time];
    //console.log(slot);
    var slotTime = slot.time;
    if (date.getTime() == slotTime.getTime() && slot.av == true) {
        check = true;
        
    }
    if (check) {
        var test= JSON.stringify(appointment);
        broker.publish(broker.validatorTopic,test);
    } else {
        broker.publish(broker.validatorTopic,"false");
    }
}
function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
exports.checkAppointment = checkAppointment;