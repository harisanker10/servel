import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { User } from './users.schema';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private userService: UsersService) {}

  @EventPattern('user_created')
  addUser(data: User) {
    console.log({ userCreatedEvent: data });
    const { email, id, githubId, isBlocked, isProMember, githubAccessToken } =
      data;
    this.userService.addUser({
      email,
      id,
      githubId,
      isBlocked,
      isProMember,
      githubAccessToken,
    });
  }
}
