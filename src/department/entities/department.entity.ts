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
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Faculty } from './../../faculty/entities/faculty.entity';
import { User } from './../../user/entities/user.entity';
import Branch from './branch.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Faculty, (faculty: Faculty) => faculty.name, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  faculty: Faculty;

  @Column()
  facultyId: number;

  @OneToMany(() => Branch, (branch: Branch) => branch.department, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  branches: Branch[];

  @OneToMany(() => User, (user) => user.user_id)
  users: User[];
}
