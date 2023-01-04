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
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { JwtAuthGuard } from './../auth/auth.guard';
import { Role } from './../auth/role/role.enum';
import { Approval } from './entities/approval.entity';
import { Roles } from 'src/auth/role/role.decorator';
import { RolesGuard } from 'src/auth/role/role.guard';
import { ApprovalService } from './approval.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Controller({
  version: '1',
  path: 'approval',
})
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  /**
   * Creates a new approval record
   * @param createApprovalDto DTO containing the required data for creating a new approval record
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createApprovalDto: CreateApprovalDto, @Req() request) {
    return this.approvalService.create(createApprovalDto, request.user);
  }

  /**
   * Retrieves a list of all approval records
   * @param query Query parameters for filtering and sorting the results
   */
  @Get()
  findAll(@Query() query: FindOptionsWhere<Approval>) {
    return this.approvalService.findAll(query);
  }

  /**
   * Retrieves a single approval record with the given id
   * @param id ID of the approval record to retrieve
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.approvalService.findOne(id);
  }

  /**
   * Updates an existing approval record with the given id
   * @param id ID of the approval record to update
   * @param updateApprovalDto DTO containing the data to update for the approval record
   */
  @Patch('/approve/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.REGISTRAR,
    Role.RESIDENT_DIRECTOR,
    Role.DEAN,
    Role.HEAD_OF_DEPARTMENT,
    // Role.STAFF,
  )
  update(
    @Param('id') id: string,
    @Body() updateApprovalDto: UpdateApprovalDto,
    @Req() request,
  ) {
    // const approval = this.approvalService.findOne(id);
    return this.approvalService.update({
      id,
      updateApprovalDto,
      requestUser: request.user,
    });
  }

  /**
   * Deletes an existing approval record with the given id
   * @param id ID of the approval record to delete
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.approvalService.remove(+id);
  }

  @Get('/apt/test')
  test() {
    return this.approvalService.test();
  }
}
