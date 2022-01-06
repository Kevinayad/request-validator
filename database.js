var mongoose = require('mongoose');
const mongoURI = "mongodb+srv://team12user:team12developer@dit355team12cluster.bwr7a.mongodb.net/dentistimodb?retryWrites=true";

var scheduleCollection;
var schedule;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
        var conn = mongoose.connection;
        scheduleCollection = conn.collection("schedule");
      
        async function showSchedule(){
            // schedule= await getSchedule();
             var app;
             await run(app);
            //console.log(schedule)
                }        
        showSchedule();
        //console.log(schedule);
      
    });
    async function run(sche){
       sche=await getSchedule();
      // console.log(sche);
       return sche;
    }
    async function getSchedule(){
       return await scheduleCollection.findOne({});
    }
    exports.schedule=schedule;
    exports.run=run;