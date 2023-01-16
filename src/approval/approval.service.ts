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
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role/role.enum';
import { ApprovalStatus } from 'src/leave.constants';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import {
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { LeaveService } from './../leave/leave.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { Approval } from './entities/approval.entity';

/**
 * A service that handles the approval process.
 * @constructor
 * @param {Repository<Approval>} approvalRepository - The repository for the approval model.
 * @param {UserService} userService - The service for the user model.
 * @param {LeaveService} leaveService - The service for the leave model.
 */
@Injectable()
export class ApprovalService {
  constructor(
    @InjectRepository(Approval)
    private readonly approvalRepository: Repository<Approval>,
    private readonly userService: UserService,
    private readonly leaveService: LeaveService,
  ) {}
  /**
   * Create a new approval.
   * @param {CreateApprovalDto} createApprovalDto - The approval to create.
   * @param {User} requestUser - The user making the request.
   * @returns {Promise<Approval>} The created approval.
   */
  async create(
    createApprovalDto: CreateApprovalDto,
    requestUser: User,
  ): Promise<Approval> {
    const user = await this.userService.findOne(requestUser.user_id);
    if (!user) {
      throw new BadRequestException('user not found');
    }
    const approvalStatues = {};
    switch (user.role) {
      case Role.STAFF:
        approvalStatues['isHodApproved'] = ApprovalStatus.PENDING;
        approvalStatues['isStaffApproved'] = ApprovalStatus.NO_PRIVILEGE;
        break;
      case Role.HEAD_OF_DEPARTMENT:
        approvalStatues['isStaffApproved'] = ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isHodApproved'] = ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isDeanApproved'] = ApprovalStatus.PENDING;
        break;
      case Role.DEAN:
        approvalStatues['isStaffApproved'] = ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isHodApproved'] = ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isDeanApproved'] = ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isResidentDirectorApproved'] = ApprovalStatus.PENDING;
        break;
      case Role.RESIDENT_DIRECTOR:
        approvalStatues['isStaffApproved'] = ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isHodApproved'] = ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isDeanApproved'] = ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isResidentDirectorApproved'] =
          ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isRegistrarApproved'] = ApprovalStatus.PENDING;
        break;
      case Role.STUDENT:
        approvalStatues['isRegistrarApproved'] = ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isResidentDirectorApproved'] =
          ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isDeanApproved'] = ApprovalStatus.NO_PRIVILEGE;
        approvalStatues['isStaffApproved'] = ApprovalStatus.PENDING;
        break;
      default:
        break;
    }
    try {
      const approval = await this.approvalRepository.save({
        ...createApprovalDto,
        ...approvalStatues,
        user_id: user.user_id,
      });
      this.leaveService.create(approval);
      return approval;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Finds all approvals that match the given options.
   * @param {FindOptionsWhere<Approval>} options - the options to find the approvals with.
   * @returns {Promise<Approval[]>} - the list of approvals that match the given options.
   */
  async findAll(options: FindOptionsWhere<Approval>): Promise<Approval[]> {
    const updatedOptions = { ...options };
    if (options.date) {
      updatedOptions.startDate = LessThanOrEqual(
        new Date(<string>options.date),
      );
      updatedOptions.endDate = MoreThanOrEqual(new Date(<string>options.date));
    }
    delete updatedOptions.date;
    const data = await this.approvalRepository.find({
      relations: ['user', 'user.department', 'user.branch', 'user.faculty'],
      relationLoadStrategy: 'join',
      where: updatedOptions,
    });
    return data;
  }

  // async findByDate(currentDate: string): Promise<[Approval, number]> {
  //   const approvals = await this.approvalRepository
  //     .createQueryBuilder('approval')
  //     .where('date(approval.startDate) <= :currentDate', { currentDate })
  //     .andWhere('date(approval.endDate) >= :currentDate', { currentDate })
  //     .getManyAndCount();
  //   return approvals;
  // }

  /**
   * Finds an approval by id.
   * @param {string} id - the id of the approval to find
   * @returns {Promise<Approval>} - the approval with the given id
   */
  async findOne(id: string): Promise<Approval> {
    return await this.approvalRepository.findOneBy({
      id,
    });
  }

  /**
   * Updates the approval with the given id.
   * @param {string} id - The id of the approval to update.
   * @param {UpdateApprovalDto} updateApprovalDto - The updated approval.
   * @param {User} requestUser - The user who requested the update.
   * @returns None
   */
  async update({
    id,
    updateApprovalDto,
    requestUser,
  }: {
    id: string;
    updateApprovalDto: UpdateApprovalDto;
    requestUser: User;
  }) {
    // Fetch the approval from the database
    const approval = await this.approvalRepository.findOne({
      where: { id },
      relations: ['user', 'user.department', 'user.faculty'],
    });
    if (!approval) {
      // Return a 404 Not Found error if the approval does not exist
      throw new NotFoundException('Approval request does not exist');
    }
    const user = await this.userService.findOne(requestUser.user_id);
    console.log(user);
    const updatedApprovalDto: UpdateApprovalDto = {};
    if (approval.isApproved || approval.isRejected) {
      throw new BadRequestException(
        'The approval has already been approved or rejected',
      );
    }
    console.log(approval);
    switch (user.role) {
      case Role.REGISTRAR:
        if (
          (approval.isResidentDirectorApproved === ApprovalStatus.APPROVED ||
            approval.isRegistrarApproved === ApprovalStatus.NO_PRIVILEGE) &&
          updateApprovalDto.isRegistrarApproved === ApprovalStatus.APPROVED
        ) {
          updatedApprovalDto.isRegistrarApproved = ApprovalStatus.APPROVED;
          updatedApprovalDto.isApproved = true;
        } else if (
          updateApprovalDto.isRegistrarApproved === ApprovalStatus.REJECTED
        ) {
          updatedApprovalDto.isRegistrarApproved = ApprovalStatus.REJECTED;
          updatedApprovalDto.isRejected = true;
        }
        break;
      case Role.RESIDENT_DIRECTOR:
        if (
          (approval.isDeanApproved === ApprovalStatus.NO_PRIVILEGE ||
            approval.isDeanApproved === ApprovalStatus.APPROVED) &&
          updateApprovalDto.isResidentDirectorApproved ===
            ApprovalStatus.APPROVED
        ) {
          updatedApprovalDto.isResidentDirectorApproved =
            ApprovalStatus.APPROVED;
          updatedApprovalDto.isRegistrarApproved = ApprovalStatus.PENDING;
        } else if (
          updateApprovalDto.isResidentDirectorApproved ===
          ApprovalStatus.REJECTED
        ) {
          updatedApprovalDto.isResidentDirectorApproved =
            ApprovalStatus.REJECTED;
          updatedApprovalDto.isRejected = true;
        }
        break;
      case Role.DEAN:
        if (
          (approval.isHodApproved === ApprovalStatus.APPROVED ||
            approval.isHodApproved === ApprovalStatus.NO_PRIVILEGE) &&
          updateApprovalDto.isDeanApproved === ApprovalStatus.APPROVED &&
          user.facultyId === approval.user.facultyId
        ) {
          updatedApprovalDto.isDeanApproved = ApprovalStatus.APPROVED;
          updatedApprovalDto.isResidentDirectorApproved =
            ApprovalStatus.PENDING;
        } else if (
          updateApprovalDto.isDeanApproved === ApprovalStatus.REJECTED
        ) {
          updatedApprovalDto.isDeanApproved = ApprovalStatus.REJECTED;
          updatedApprovalDto.isRejected = true;
        }
        break;
      case Role.HEAD_OF_DEPARTMENT:
        if (
          approval.user.role === Role.STAFF &&
          updateApprovalDto.isHodApproved === ApprovalStatus.APPROVED &&
          user.facultyId === approval.user.facultyId &&
          user.departmentId === approval.user.departmentId
        ) {
          updatedApprovalDto.isHodApproved = ApprovalStatus.APPROVED;
          updatedApprovalDto.isDeanApproved = ApprovalStatus.PENDING;
        }
        break;
    }
    // return null if nothing was updated
    if (Object.keys(updatedApprovalDto).length === 0) {
      return null;
    }
    console.log(updatedApprovalDto);
    updateApprovalDto.leaveId = this.leaveService.update({
      ...approval,
      ...updatedApprovalDto,
    })[0];
    return await this.approvalRepository.update(id, updatedApprovalDto);
  }

  // TODO:
  remove(id: number) {
    return `This action removes a #${id} approval`;
  }
  // TODO: REMOVE testing code
  async test() {
    const t = await this.approvalRepository.findOneBy({
      id: 'f19784ae-8426-47c3-9289-c735177de1da',
    });
    console.log('Approval', t);
    return await this.leaveService.update(t);
  }
}
