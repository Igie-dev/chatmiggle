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
          <div style="font-family: Helvetica,Arial,sans-serif;width:100%;font-size:1em; max-width: 50rem;overflow:auto;line-height:1;display:flex; align-items:start;">
              <div style="margin:5px auto;width:100%; padding:2rem;">
              
              <div style="border-bottom:1px solid #eee; padding-top: 1em; padding-bottom: 1em;">
                      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">chatMiggle</a>
                  </div>

                  <p>Hello, Welcome to chatMiggle</p>
      
                  <h2 style="font-weight:300">Your Otp code:</h2>
                  <h2 style="background: #00466a;margin: 0;width: max-content;padding: 1rem 3rem;color: #fff;border-radius: 4px;">${otp}</h2>
                  <p style=" margin-top: 2rem; font-weight:300;">This code will expire in 5 minutes.</p>
                  <p >Regards,<br />Faculty</p>
                  <hr style="border:none;border-top:1px solid #eee" />
      
                  <div style="float:left;padding:8px 0;color:#aaa;line-height:1;font-weight:300">
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
