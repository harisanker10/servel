import { Transporter, createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { getOtpHtml } from './mail/templates/otpHTML';

export class MailerService {
  transport: Transporter;
  private from: string;
  constructor() {
    this.transport = createTransport({
      service: 'Gmail',
      // host: 'smtp.gmail.com',
      auth: {
        user: 'harisanker10@gmail.com',
        pass: 'bvoq yppt kzjg jibg',
      },
    });
    this.transport.verify((err) => {
      if (err) {
        console.log(err);
        throw new Error('transport failed');
      }
    });
    this.from = 'harisanker10@gmail.com';
  }

  private async sendMail(mailOptions: MailOptions) {
    console.log('sending mail', { mailOptions });
    return new Promise((res, rej) => {
      this.transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          rej({ success: false });
        } else {
          res({ success: true, info });
        }
      });
    });
  }

  async sendOtpEmail(email, otp) {
    const mailOptions: Options = {
      to: email,
      from: this.from,
      subject: 'Verification Code',
      text: `Your verification code is: ${otp}`,
      html: getOtpHtml(otp),
    };
    return this.sendMail(mailOptions);
  }
}
