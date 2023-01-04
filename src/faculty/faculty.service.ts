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

import { Faculty } from './entities/faculty.entity';
import { Injectable } from '@nestjs/common';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
  ) {}
  create(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    return this.facultyRepository.save(createFacultyDto);
  }

  async findAll(): Promise<Faculty[]> {
    return this.facultyRepository.find({
      relations: ['departments'],
      relationLoadStrategy: 'join',
    });
  }

  async findOne(id: number): Promise<Faculty> {
    return this.facultyRepository.findOneBy({
      id: id,
    });
  }

  async update(
    id: number,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<UpdateResult> {
    return await this.facultyRepository.update(id, updateFacultyDto);
  }

  async remove(id: number) {
    return await this.facultyRepository.delete(id);
  }
}
