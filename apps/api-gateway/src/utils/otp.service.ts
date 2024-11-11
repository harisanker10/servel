import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

type OtpData = Readonly<{ otp: string; validity: Date }>;

@Injectable()
export class OtpService {
  private otps: Map<string, OtpData>;
  private validTimeInMs: number;
  constructor() {
    console.log('\n\nInited otp service\n\n');
    this.otps = new Map();
    //setting validity for 5mins
    this.validTimeInMs = 300 * 1000;
  }

  generateOtp(email: string): Readonly<OtpData> {
    const otp = randomInt(100000, 999999).toString();
    const validity = new Date(new Date().getTime() + this.validTimeInMs);
    const otpData: OtpData = { otp, validity };
    this.otps.set(email, otpData);
    setTimeout(
      () => {
        this.otps.delete(otp);
      },
      1000 * 60 * 10,
    );
    return otpData;
  }

  checkValidity(email: string, otp: string): boolean {
    const saved = this.otps.get(email);
    if (saved === undefined) return false;
    if (saved.otp !== otp) return false;
    if (saved.validity.getTime() < new Date().getTime()) {
      return false;
    }
    return true;
  }
}
