import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const existingUser = await this.findOne({ username });
    if (existingUser)
      throw new ConflictException(`User with username ${username} already exists!`);

    const user = new User();
    user.username = username;
    user.password = password;
    await user.save();
  }
}