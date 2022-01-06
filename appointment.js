const database= require("./database.js");
const broker= require("./broker/broker.js")
async function checkAppointment(appointment) {
    var schedule;
    var res = await database.showSchedule(schedule);
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
exports.checkAppointment = checkAppointment;