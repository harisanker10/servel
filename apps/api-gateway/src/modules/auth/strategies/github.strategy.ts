import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { Request } from 'express';
import { env } from 'process';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { displayName, username, photos, emails } = profile;
    return {
      fullname: displayName,
      githubId: username,
      avatar: photos?.length && photos[0]?.value,
      email: emails?.length && emails[0]?.value,
      accessToken,
      refreshToken,
    };
  }
}
