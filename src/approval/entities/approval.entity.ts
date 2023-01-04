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

import { Leave } from './../../leave/entities/leave.entity';
import { User } from './../../user/entities/user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApprovalStatus, LeaveSession, LeaveType } from '../../leave.constants';

@Entity()
export class Approval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user: User) => user.name)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  reason: string;

  @Column({ type: 'timestamp with time zone' })
  startDate: Date;

  @Column({ type: 'timestamp with time zone' })
  endDate: Date;

  // @Column({ default: false })
  // isHalfDay: boolean;

  @Column({ type: 'enum', enum: LeaveSession })
  leaveSession: LeaveSession;

  @Column({ type: 'enum', enum: LeaveType })
  leaveType: LeaveType;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.NOT_CHECKED,
  })
  isReigistrarApproved: ApprovalStatus;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.NOT_CHECKED,
  })
  isResidentDirectorApproved: ApprovalStatus;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.NOT_CHECKED,
  })
  isDeanApproved: ApprovalStatus;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.NOT_CHECKED,
  })
  isHodApproved: ApprovalStatus;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.NOT_CHECKED,
  })
  isStaffApproved: ApprovalStatus;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: false })
  isRejected: boolean;

  // not to be stored in the database
  date: string;

  @ManyToOne(() => Leave, (leave: Leave) => leave.approvals, { nullable: true })
  @JoinColumn({ name: 'leaveId' })
  leave: Leave;

  @Column({ nullable: true })
  leaveId: string;
}
