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
import { Repository, UpdateResult } from 'typeorm';
import { Carry } from './entities/carry.entity';
/**
 * Finds a carry by the user_id.
 * @param {string} user_id - the user_id of the carry to find
 * @returns {Promise<Carry>} - the carry that was found
 */
@Injectable()
export class CarryService {
  constructor(
    @InjectRepository(Carry)
    private readonly carryRepository: Repository<Carry>,
  ) {}

  /**
   * Creates a new Carry object in the database.
   * @param {string} user_id - the user id of the user who is carrying the item.
   * @returns {Carry} - the newly created Carry object.
   */
  async create(user_id: string): Promise<Carry> {
    return await this.carryRepository.save({
      user_id: user_id,
    });
  }

  /**
   * Increments the days of the carry by the given value.
   * @param {string} user_id - the user id of the carry to update
   * @param {number} value - the value to increment the days by
   * @returns {Promise<UpdateResult>} - the result of the update
   */
  async increment(user_id: string, value: number): Promise<UpdateResult> {
    const carry = await this.carryRepository.findOneBy({
      user_id: user_id,
    });
    if (!carry) {
      throw new BadRequestException('Carry not found');
    }
    carry.days += value;
    return await this.carryRepository.update(carry.id, carry);
  }

  /**
   * Decrements the number of days in the carry for the given user_id.
   * @param {string} user_id - the user_id of the carry to decrement
   * @param {number} value - the number of days to decrement the carry by
   * @returns {Promise<UpdateResult>} - the result of the update
   */
  async decrement(user_id: string, value: number): Promise<UpdateResult> {
    const carry = await this.carryRepository.findOneBy({
      user_id: user_id,
    });
    if (!carry) {
      throw new BadRequestException('Carry not found');
    }
    if (carry.days < 0) {
      // TODO: Give a better error message
      throw new BadRequestException('???');
    }
    carry.days -= value;
    return await this.carryRepository.update(carry.id, carry);
  }

  /**
   * Finds a carry by user_id.
   * @param {string} user_id - the user_id of the carry to find
   * @returns {Promise<Carry>} - the carry that was found
   */
  async findOne(user_id: string) {
    return await this.carryRepository.findOneBy({
      user_id: user_id,
    });
  }
}
