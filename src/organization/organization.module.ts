import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from './entities/organization/organization.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationRepository]),
    AuthModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService]
})
export class OrganizationModule {}
