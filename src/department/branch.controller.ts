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

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch';
@Controller({
  version: '1',
  path: 'branch',
})
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  async create(@Body() createBranchDto: CreateBranchDto) {
    try {
      return await this.branchService.create(createBranchDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  findAll() {
    return this.branchService.findAll();
  }

  @Get(':departmentId')
  findOneByDepartmentId(departmentId: number) {
    return this.branchService.findByDepartment(departmentId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.branchService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(id, updateBranchDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.branchService.delete(id);
  }
}
