import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from '../../dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../enums/user-role.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();

    const user = User.create({
      username,
      salt,
      password: await this.hashPassword(password, salt),
    });

    try {
      await user.save();
    } catch(error) {
      switch (error.code) {
        case '23505': throw new ConflictException(`User with username ${username} already exists!`);
        default: throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password))
      return username;

    return null;
  }

  async modifyRoleAndGetUser(user: User, role: UserRole): Promise<User> {
    // updating the user's role
    user.role = role;
    await user.save();

    // getting rid of the sensitive information
    delete user.password;
    delete user.salt;
    delete user.tasks;

    return user;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}