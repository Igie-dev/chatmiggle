import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
const appName = process.env.APP_NAME;
const mailerEmail = process.env.SYSTEM_EMAIL;
const mailerPass = process.env.MAILER_PASSWORD;

const otpEmail = (email, otp) => {
  return new Promise(async (resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailerEmail,
        pass: mailerPass,
      },
    });

    const mail_config = {
      from: mailerEmail,
      to: email,
      subject: "Email verification Otp",
      html: `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <title>Email verification Otp</title>
      
      </head>
      
      <body>
          <!-- partial:index.partial.html -->
          <div style="font-family: Helvetica,Arial,sans-serif;width:100%;
                      overflow:auto;
                      display:flex; align-items:center;">
              <div style="margin:5px auto; width:100%; padding:2rem; max-width: 50rem; border:1px solid #eee; border-radius: 10px;">
              
              <div style="border-bottom:1px solid #eee; padding-top: 1em; padding-bottom: 1em;">
                      <a href="" style="font-size:1.5em; color: #00466a;text-decoration:none;">${appName}</a>
                  </div>
                  <p>Hello, Welcome to ${appName}</p>
                  <p style="margin: 2rem 0; font-weight: 600;">Your otp code: ${otp}</p>
                  <p style="margin-top: 2rem; font-weight:300;">This code will expire in 5 minutes.</p>
                  <p style="font-size:.9em;">Regards,<br />${appName}</p>
                  <hr style="border:none;border-top:1px solid #eee" />
                  <div style="color:#aaa;font-weight:300;font-size:.9em;">
                      <p>${appName}</p>
                      <p>Manila </p>
                      <p>Philippines</p>
                  </div>
              </div>

          </div>
          <!-- partial -->
      
      </body>
      
      </html>`,
    };

    transporter.sendMail(mail_config, (err, info) => {
      if (err) {
        return reject({ message: "Something wrong in mailer!" });
      }
      return resolve({ message: "Email sent succesfully!" });
    });
  });
};

export default otpEmail;
