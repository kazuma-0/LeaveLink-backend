import { BadRequestException } from '@nestjs/common';
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
import { DeleteResult, Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch';
import Branch from './entities/branch.entity';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<any> {
    try {
      return await this.branchRepository.save(createBranchDto);
    } catch (e) {
      throw new BadRequestException('Branch already exists');
    }
  }

  async findAll(): Promise<Branch[]> {
    return await this.branchRepository.find({
      relations: ['department'],
      relationLoadStrategy: 'join',
    });
  }

  async findOne(id: number): Promise<Branch> {
    return await this.branchRepository.findOneBy({ id: id });
  }

  async findByDepartment(departmentId: number): Promise<Branch[]> {
    return await this.branchRepository.findBy({
      departmentId,
    });
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    return await this.branchRepository.update(id, updateBranchDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.branchRepository.delete(id);
  }
}
