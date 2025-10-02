const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron = require("node-cron");
const connectionRequest = require('../models/connectionRequest')
const sendEmail = require('./ses_sendemail');



cron.schedule("06 22 * * *", async () => {
    console.log("enetr cron")
    try {
        const yesterday = subDays(new Date(),0);
        // const yesterdayStart = startOfDay(yesterday);
        // const yesterdayEnd = endOfDay(yesterday);


         const yesterdayStartUTC = new Date(
           Date.UTC(
             yesterday.getUTCFullYear(),
             yesterday.getUTCMonth(),
             yesterday.getUTCDate(),
             0,
             0,
             0
           )
         );
         const yesterdayEndUTC = new Date(
           Date.UTC(
             yesterday.getUTCFullYear(),
             yesterday.getUTCMonth(),
             yesterday.getUTCDate(),
             23,
             59,
             59,
             999
           )
         );


         console.log("Query range:", yesterdayStartUTC, "to", yesterdayEndUTC);

        const pendingRequest = await connectionRequest
          .find({
            status: "interested",
            createdAt: {
              $gte: yesterdayStartUTC, // Greater Than or Equal To
              $lt: yesterdayEndUTC, //Less Than
            },
          })
          .populate("fromUserId toUserId");

         console.log("Pending requests:", pendingRequest.length);

        const listOfEmails = [...new Set(pendingRequest.map((item) => item.toUserId.email))];//This will basically push all the unique values in my set and then convert it into array i will spread all the value in the array using ...operator
         console.log("Unique emails:", listOfEmails);
        
        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run(`New Friend Request pending for"${email}`, "There are so many Pending request pendinf please login to website and Accept your Pending request.")
                
                console.log(".....",res)
            }
            catch (err) {
                 console.log(err);
            }
        }
    }
    catch (err) {
        console.log(err)
    }
});
