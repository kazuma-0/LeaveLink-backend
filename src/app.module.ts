// Copyright (c) 2023 Anuj S and The Wired
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApprovalModule } from './approval/approval.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentModule } from './department/department.module';
import { FacultyModule } from './faculty/faculty.module';
import { LeaveModule } from './leave/leave.module';
import { UserModule } from './user/user.module';
console.log(join(__dirname, '../..', 'uploads'));
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      autoLoadEntities: true,
      // synchronize: true,
      useUTC: true,
    }),
    AuthModule,
    UserModule,
    FacultyModule,
    DepartmentModule,
    LeaveModule,
    ApprovalModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'uploads'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
