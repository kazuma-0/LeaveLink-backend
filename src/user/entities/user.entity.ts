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

import Branch from 'src/department/entities/branch.entity';
import { Department } from 'src/department/entities/department.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Approval } from './../../approval/entities/approval.entity';
import { Role } from './../../auth/role/role.enum';
import { Faculty } from './../../faculty/entities/faculty.entity';

@Entity()
export class User {
  @Column()
  name: string;
  @PrimaryColumn()
  user_id: string;
  @Column({})
  date_of_birth: string;
  // @Column({ nullable: true })
  @Column({ select: false })
  password: string;

  @ManyToOne(() => Branch, (branch: Branch) => branch.name, { nullable: true })
  @JoinColumn()
  branch: Branch;

  @Column({ nullable: true })
  branchId: number;

  @ManyToOne(() => Department, (department: Department) => department.name, {
    nullable: true,
  })
  @JoinColumn()
  department: Department;
  @Column({ nullable: true })
  departmentId: number;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @ManyToOne(() => Faculty, (faculty: Faculty) => faculty.id, {
    nullable: true,
  })
  @JoinColumn()
  faculty: Faculty;

  @Column({ nullable: true })
  facultyId: number;

  @OneToMany(() => Approval, (approval: Approval) => approval.id)
  approval: Approval[];
}
