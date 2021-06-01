import axios from "axios";
import nodemailer from "nodemailer";
import express from "express";

const port = process.env.PORT || 8002;
// App Config
const app = express();
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 })
var email_service = true;


// SMTP Settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'sreejit.research@gmail.com',
        pass: 'Research@123'
    }
});

//Email recievers
const receivers = [
    "samkit.nahar00@gmail.com",
    "sreejitkar999@gmail.com",
    "rohankar1999@gmail.com",
    "nandinigarg414@gmail.com",
    "ashutoshroywork@gmail.com",
    "kesarwanishashank33@gmail.com"
]


// Toggle Email Service API
app.get('/toggle', function (req, res) {
    email_service = !email_service;
    res.end(" Email service has been set to : "+email_service);
    });



// HTTP Axios Call to SetuServer of CoVIN
async function SetuCall(callingDate) {
    try {
        const response = await axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=265&date=' + callingDate)
        for (let center of response.data.sessions) {
            if ((center.available_capacity_dose1 > 0) && (center.min_age_limit == 18)) {

                if (email_service) {

                    var response_text = 'Hi, Get ready for some real fkn vaccine bitches cause its here at :' + "\nAvailable Doses : " + center.available_capacity_dose1 + "\nDate : " + center.date + "\nAddress : " + center.name + center.address + "\nCity : "+ center.district_name + "\nState : "+ center.state_name +"\nPin : " + center.pincode+ "\nVaccine Name : " + center.vaccine + "\nFee : " + center.fee_type;
                    await transporter.sendMail({
                        from: 'sreejit.research@gmail.com',
                        to: receivers,
                        subject: 'Covin Notifier',
                        text: response_text,
                    });
                }

            }
        }
    } catch (error) {
        console.log(error.response);
    }
};


//Cron Function
function RunByCron() {
    for (var i = 0; i <= 9; i++) {
        function hoist(i) {
            setTimeout(
                function () {
                    var date = new Date();
                    date.setDate(date.getDate() + i);
                    var stringDate = date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getFullYear();
                    SetuCall(stringDate);
                }, 4000)
        }
        hoist(i);
    }
}




RunByCron();

// Half-Minutely Cron Job
setInterval(RunByCron, 31000);
