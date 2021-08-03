const nodemailer = require("nodemailer");

const sendMail = (linkVerify, mail, id) => {
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
      subject: "Xác nhận mua vé máy bay",
      //You can use "html:" to send HTML email content. It's magic!
      html: `
        <div style="background: #003c71">
          <img 
            style="object-fit: cover; margin: 12px auto;"
            src="https://cdn1.ivivu.com/images/Flight/banner-t-ivivu-vietnamxinhdep1.png" 
            alt="Hình ảnh">
        </div>
        <p>
        Mã đơn hàng:  <strong>${id}</strong>
        </p>
        <strong>Chúng tôi đã nhận được đơn hàng của bạn. 
        Bạn hãy vào trang chủ và xem thông tin chi tiết đơn đặt hàng theo link sau: </strong>
        
        <p>Chi tiết đơn đặt hàng: </p>
        <a href="${linkVerify}">Xác nhận </a>
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
