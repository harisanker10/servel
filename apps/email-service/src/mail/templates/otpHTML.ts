export const getOtpHtml = (verificationCode) =>
  `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Verification Code</title>
          <style>
            /* Add your custom styles here */
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .verification-code {
              font-size: 24px;
              font-weight: bold;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Verification Code</h1>
          <p>Please use the following code to verify your account:</p>
          <div class="verification-code">${verificationCode}</div>
          <p>If you did not request this verification code, please ignore this email.</p>
        </body>
      </html>
    `;
