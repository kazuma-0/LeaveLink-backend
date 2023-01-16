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

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Approval } from '../approval/entities/approval.entity';
import { LeaveType } from '../leave.constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CarryService } from './carry.service';
import { Leave } from './entities/leave.entity';

/**
 * A service that handles the creation and removal of leaves.
 * @param {Repository<Leave>} leaveRepository - The repository for the Leave entity.
 * @param {CarryService} carryService - The service for handling carry leaves.
 */
@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private readonly leaveRepository: Repository<Leave>,
    private readonly carryService: CarryService,
  ) {}
  /**
   * Creates a leave request for the given approval.
   * @param {Approval} approval - The approval object.
   * @returns None
   */
  async create(approval: Approval) {
    const startMonth = new Date(approval.startDate).getMonth() + 1;
    const startYear = new Date(approval.startDate).getFullYear();
    const endMonth = new Date(approval.endDate).getMonth() + 1;
    const endYear = new Date(approval.endDate).getFullYear();
    this.leaveRepository.save({
      month: startMonth,
      year: startYear,
      user_id: approval.user_id,
    });
    if (startMonth != endMonth || startYear != endYear) {
      // logic for handling if the end date is in the next month and year
      this.leaveRepository.save({
        month: endMonth,
        year: endYear,
        user_id: approval.user_id,
      });
    }
  }

  /**
   * Find all leaves that match the given options.
   * @param {FindOptionsWhere<Leave>} options - The options to find the leaves with.
   * @returns {Promise<Leave[]>} A promise that resolves to an array of leaves.
   */
  async findAll(options: FindOptionsWhere<Leave>) {
    return await this.leaveRepository.find({
      where: options,
      relations: ['user', 'user.branch'],
      relationLoadStrategy: 'join',
    });
  }

  /**
   * Finds a leave request by its id.
   * @param {string} id - the id of the leave request to find
   * @returns {Promise<LeaveRequest>}
   */
  async findOne(options: FindOptionsWhere<Leave>) {
    return await this.leaveRepository.findOne({ where: options });
  }

  /**
   * Checks if the leave type is available for the given date.
   * @param {LeaveType} type - the type of leave to check
   * @param {number} date - the date to check
   * @param {number} avaiable - the number of available leave
   * @returns None
   */
  checkLeaveAvailability(type: LeaveType, date: number, avaiable: number) {
    if (type === LeaveType.CASUAL && avaiable === 0) {
      throw new BadRequestException('Leave not available');
    }
  }

  /**
   * Updates the leave balance of the user with the given user_id.
   * @param {Approval} approval - The approval object.
   * @returns None
   */
  async update(approval: Approval) {
    const { id, isApproved, startDate, endDate, user_id, leaveType } = approval;
    if (!isApproved) {
      return;
    }
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    const daysInMonth = moment(startDate).daysInMonth();
    const { days: leaves_available } = await this.carryService.findOne(user_id);
    // Do I need this since I'll be adding the change on the frontend?
    if (leaveType === LeaveType.CASUAL && leaves_available === 0) {
      // TODO: better error message
      throw new BadRequestException(
        'Cannot apply for casual leave for more than avaiable days',
      );
    }
    if (startMonth !== endMonth) {
      const startDays = daysInMonth + 1 - startDay;
      const endDays = endDate.getDate();
      if (leaveType === LeaveType.CASUAL && startDays > leaves_available) {
        // TODO: better error message
        throw new BadRequestException(
          'Cannot apply for casual leave for more than avaiable days',
        );
      }
      const prevMonth = await this.leaveRepository.findOne({
        where: {
          month: startMonth,
          year: startDate.getFullYear(),
          user_id: user_id,
        },
      });
      const nextMonth = await this.leaveRepository.findOne({
        where: {
          month: endMonth,
          year: endDate.getFullYear(),
          user_id: user_id,
        },
      });
      if (
        prevMonth.approvals.includes(id) &&
        nextMonth.approvals.includes(id)
      ) {
        throw new BadRequestException('Approval already accepted');
      }
      switch (leaveType) {
        case LeaveType.CASUAL:
          prevMonth.casualLeaves += startDays;
          nextMonth.casualLeaves += endDays;
          break;
        case LeaveType.PERMISSION:
          prevMonth.permissionLeaves += 1;
          nextMonth.permissionLeaves += 1;
          break;
        case LeaveType.ON_DUTY:
          prevMonth.onDutyLeaves += startDays;
          nextMonth.onDutyLeaves += endDays;
          break;
        case LeaveType.COMPENSATION:
          prevMonth.compensationLeaves += startDays;
          nextMonth.compensationLeaves += endDays;
          break;
      }
      prevMonth.approvals.push(approval.id);
      nextMonth.approvals.push(approval.id);
      this.leaveRepository.update(prevMonth.id, prevMonth);
      this.leaveRepository.update(nextMonth.id, nextMonth);
      return [prevMonth.id, nextMonth.id];
    } else {
      const days = endDay - startDay + 1;
      console.log(days);
      const leave = await this.leaveRepository.findOne({
        where: {
          year: startDate.getFullYear(),
          month: startMonth,
          user_id: user_id,
        },
      });
      if (leave.approvals.includes(id)) {
        throw new BadRequestException('Approval already accepted');
      }
      switch (leaveType) {
        case LeaveType.CASUAL:
          leave.casualLeaves += days;
          break;
        case LeaveType.PERMISSION:
          leave.permissionLeaves += 1;
          break;
        case LeaveType.ON_DUTY:
          leave.onDutyLeaves += days;
          break;
        case LeaveType.COMPENSATION:
          leave.compensationLeaves += days;
          break;
      }
      leave.approvals.push(approval.id);
      console.log(leave);
      this.leaveRepository.update(leave.id, leave);
      return [leave.id];
    }
  }

  remove(id: number) {
    return `This action removes a #${id} leave`;
  }
}
