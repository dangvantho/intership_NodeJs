const nodemailer = require("nodemailer");

const sendMail = (linkVerify, mail) => {
  const nodemailerMailgun = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "dangvantho1234asdf0@gmail.com",
      pass: "dioxsxcjljrrvenv",
    },
  });

  nodemailerMailgun.sendMail(
    {
      from: "dangvantho1234asdf0@gmail.com",
      to: mail, // An array if you have multiple recipients.
      subject: "Xác nhận thông tin đăng ký",
      //You can use "html:" to send HTML email content. It's magic!
      html: `
        <div style="background: #003c71">
          <img 
            style="object-fit: cover; margin: 12px auto;"
            src="https://cdn1.ivivu.com/images/Flight/banner-t-ivivu-vietnamxinhdep1.png" 
            alt="Hình ảnh">
        </div>
        <strong>Please confirm your email</strong>
        <p>
        This email has been sent to verify that <a href="">${mail}</a> 
        is a valid email address .
        </p>
        <p>To start sending from your email address you must click the link below to verify that you approve this action.</p>
        <a href="${linkVerify}">${linkVerify}</a>
      `,
    },
    (err, info) => {
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        console.log(`Response: ${info}`);
      }
    }
  );
};
module.exports = sendMail;
