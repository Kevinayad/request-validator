const database= require("./database.js");

async function checkAppointment(appointment) {
    var s;
    await database.run(s);
    console.log(s);
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
exports.checkAppointment = checkAppointment;