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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CarryService } from './../leave/carry.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly carryService: CarryService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = {
      ...createUserDto,
      password: await bcrypt.hash(
        createUserDto.date_of_birth,
        await bcrypt.genSalt(12),
      ),
    };
    const user = await this.userRepository.save(newUser);
    await this.carryService.create(user.user_id);
    return user;
  }

  async findAll(condition: FindOptionsWhere<User>) {
    return await this.userRepository.find({
      where: condition,
      relationLoadStrategy: 'join',
      relations: ['department', 'branch'],
      // : ['departmentId'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      user_id: id,
    });
    return user;
  }

  async findOneWithIdPassword(id: string): Promise<User> {
    const data = await this.userRepository
      .createQueryBuilder('user')
      .where('user_id = :user_id', { user_id: id })
      .addSelect('user.password')
      .getOne();
    return data;
  }

  async findProfile(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      user_id: id,
    });
    delete user.password;
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
