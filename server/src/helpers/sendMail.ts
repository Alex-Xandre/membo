const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';
require('dotenv').config();

const { G_CLIENT_ID, G_CLIENT_SECRET, G_REFRESH_TOKEN, ADMIN_EMAIL } = process.env;

const oauth2client = new OAuth2(G_CLIENT_ID, G_CLIENT_SECRET, G_REFRESH_TOKEN, OAUTH_PLAYGROUND);

const sendRegistration = (to, password_unhash, name, url, activationCode) => {
  oauth2client.setCredentials({
    refresh_token: G_REFRESH_TOKEN,
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: ADMIN_EMAIL,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: 'Test',
    to: to,
    password_unhash: password_unhash,
    url: url,
    subject: 'VERIFY ACCOUNT',
    html: `
   <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Activation</title>
  <style>
    /* Global Styles */
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      color: #050a30;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      padding-left: 20px;
      padding-right: 20px;
    }

    h1, h2 {
      margin: 0.5em 0;
      text-align: left;
    }

    a {
      color: #60b4f2;
      text-decoration: none;
    }

    /* Header Section */
    .header {
      background-color: #050a30;
      color: white;
      padding: 20px 0;
      text-align: left;
    }

    .header img {
      height: 50px;
      margin-left: 20px;
    }

    /* Container */
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    /* Button */
    .btn {
      display: inline-block;
      background-color: #60b4f2;
      color: white;
      padding: 15px 30px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 18px;
      margin-top: 20px;
      text-align: center;
    }

    /* Footer */
    .footer {
      font-size: 14px;
      margin-top: 30px;
      color: #808080;
      text-align: left;
    }
  </style>
</head>
<body>

  <div class="container">
    <h1>Verify Your Email Address</h1>
    
    <a href="${url}" class="btn">Activate Account</a>

    <h2>Your Login Credentials:</h2>
    <p>Officer ID: <strong>${name}</strong></p>
    <p>Password: <strong>${password_unhash}</strong></p>

    <h2>Use this code to verify your account:</h2>
    <p><strong>${activationCode}</strong></p>

    <div class="footer">
      <p>If you did not request this, please ignore this email.</p>
    </div>
  </div>
</body>
</html>`,
  };
  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};

const sendEmailReset = (to, url, name) => {
  oauth2client.setCredentials({
    refresh_token: G_REFRESH_TOKEN,
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: ADMIN_EMAIL,
      clientId: G_CLIENT_ID,
      clientSecret: G_CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken,
    },
  });
  const mailOptions = {
    from: 'Test',
    to: to,
    subject: 'RESET PASSWORD',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Activation</title>
      <style>
        /* Global Styles */
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f7f7;
          color: #050a30;
          margin: 0;
          padding: 0;
          line-height: 1.6;
          padding-left: 20px;
          padding-right: 20px;
        }

        h1, h2 {
          margin: 0.5em 0;
          text-align: left;
        }

        a {
          color: #60b4f2;
          text-decoration: none;
        }

        /* Header Section */
        .header {
          background-color: #050a30;
          color: white;
          padding: 20px 0;
          text-align: left;
        }

        .header img {
          height: 50px;
          margin-left: 20px;
        }

        /* Container */
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        /* Button */
        .btn {
          display: inline-block;
          background-color: #60b4f2;
          color: white;
          padding: 15px 30px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 18px;
          margin-top: 20px;
          text-align: center;
        }

        /* Footer */
        .footer {
          font-size: 14px;
          margin-top: 30px;
          color: #808080;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://res.cloudinary.com/dnhka2l80/image/upload/v1731783230/logo_mxfo3z.png" alt="Logo">
      </div>

      <div class="container">
        <h1>Reset Your Password</h1>
        <h2>Dear ${name},</h2>
        <p>Please click the button below to reset your password:</p>

        <a href="${url}" class="btn">Click Here to Reset Your Password</a>

        <div class="footer">
          <p>If you did not request this, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};


export { sendRegistration, sendEmailReset };
