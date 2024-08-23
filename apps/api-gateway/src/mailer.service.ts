export class MailerService {
  constructor() {}

  async sendVerificationCode(email: string, otp: string): Promise<boolean> {
    const data = {
      otp,
      email,
    };
    return fetch('http://localhost:4000/otp', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => false);
  }
}
