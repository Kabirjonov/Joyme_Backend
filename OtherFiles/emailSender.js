// const nodemailer = require('nodemailer')

// const sendEmail = (data) => {
//     const {name,lastname,email,message} = data
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',   // Gmail SMTP serveri
//         port: 465,                // SMTP porti (SSL)
//         secure: true,             // SSL ulanishi
//         auth: {
//             user: 'ag9386581@gmail.com',  // Email manzilingiz
//             pass: 'zifxrysmxrfizeqd',     // Google App paroli
//         },
//     });
//     transporter.sendMail(
//         {
//             from: email,
//             to: 'ag9386581@gmail.com',
//             subject: `${name} ${lastname}`,
//             text: message,
//         },
//         (err, info) => {
//             if (err) {
//                 console.error('Xatolik:', err);
//             } else {
//                 console.log('Email yuborildi:', info.response);
//             }
//         }
//     );
// }

// exports.sendEmail = sendEmail;