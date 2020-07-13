import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    TasksModule,
    AuthModule,
  ]
})
export class AppModule {}
