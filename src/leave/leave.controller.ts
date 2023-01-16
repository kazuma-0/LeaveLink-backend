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

import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { query } from 'express';
import { LeaveService } from './leave.service';

/**
 * A controller that handles the creation of a leave.
 * @param {LeaveService} leaveService - The service that handles the creation of a leave.
 * @returns None
 */
@Controller({
  path: 'leave',
  version: '1',
})
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  findAll(@Query() query) {
    return this.leaveService.findAll(query);
  }

  @Get(':id')
  findOne(@Query() query) {
    return this.leaveService.findOne(query);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
  //   // return this.leaveService.update(id, updateLeaveDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveService.remove(+id);
  }
}
