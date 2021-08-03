const nodemailer = require("nodemailer");

const sendMail = (linkVerify, mail, newPassword) => {
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
      subject: "Đổi mật khẩu",
      //You can use "html:" to send HTML email content. It's magic!
      html: `
        <div style="background: #003c71">
          <img 
            style="object-fit: cover; margin: 12px auto;"
            src="https://cdn1.ivivu.com/images/Flight/banner-t-ivivu-vietnamxinhdep1.png" 
            alt="Hình ảnh">
        </div>
        <strong>Xác nhận đổi mật khẩu</strong>
        <p>Tài khoản: ${mail}</p>
        <p>Mật khẩu mới: ${newPassword}</p>
        <p>
        Nhấn vào link sau để thay đổi mật khảu mới <a href="${linkVerify}">${linkVerify}</a> 
        </p>
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
