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

import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Approval } from './../../approval/entities/approval.entity';
export enum LeaveStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class Leave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({
  //   type: 'enum',
  //   enum: LeaveStatus,
  // })
  // status: LeaveStatus;

  @ManyToOne(() => User, (user: User) => user.name)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column({ type: 'text', default: [], array: true })
  approvals: string[];

  @Column({ default: 0 })
  casualLeaves: number;

  @Column({ default: 0 })
  compensationLeaves: number;

  @Column({ default: 0 })
  onDutyLeaves: number;

  @Column({ default: 0 })
  permissionLeaves: number;

  @Column({})
  month: number;

  @Column()
  year: number;
}
