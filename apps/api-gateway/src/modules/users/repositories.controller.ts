import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/utils/user.decorator';
import { ReqUser } from 'types/JWTPayload';
import { UserService } from './users.service';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { lastValueFrom } from 'rxjs';

@Controller('repositories')
@UseGuards(JWTGuard)
export class RepositoriesController {
  constructor(private readonly userService: UserService) {}

  @Get('/github')
  async findUserRepositories(@User() reqUser: ReqUser) {
    console.log('Fetching reposssss');
    const data = await lastValueFrom(
      await this.userService.getAccessTokens(reqUser.id, reqUser.email),
    );

    const accessTokenData = data.accessToken.find(
      (tokenData) => tokenData.provider === 'GITHUB',
    );
    if (!accessTokenData) {
      return null;
    }
    const response = await fetch(
      'https://api.github.com/user/repos?sort=created&direction=desc',
      {
        method: 'GET',
        headers: {
          Authorization: `token ${accessTokenData.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching repositories: ${response.statusText}`);
    }

    const repositories = await response.json();
    console.log({ repo: repositories[0] });
    if (Array.isArray(repositories) && repositories.length > 0) {
      return repositories.map((repo) => ({
        name: repo.name,
        url: repo.clone_url,
        isPrivate: repo.private,
      }));
    } else {
      throw new Error('Something went wrong');
    }
  }
}
