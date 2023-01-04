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

import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApprovalStatus } from 'src/leave.constants';
import { CreateApprovalDto } from './create-approval.dto';

export class UpdateApprovalDto extends PartialType(CreateApprovalDto) {
  @IsOptional()
  @IsEnum(ApprovalStatus)
  isReigistrarApproved?: ApprovalStatus;
  @IsOptional()
  @IsEnum(ApprovalStatus)
  isResidentDirectorApproved?: ApprovalStatus;
  @IsOptional()
  @IsEnum(ApprovalStatus)
  @IsOptional()
  isDeanApproved?: ApprovalStatus;
  @IsEnum(ApprovalStatus)
  @IsOptional()
  isHodApproved?: ApprovalStatus;
  @IsEnum(ApprovalStatus)
  @IsOptional()
  isStaffApproved?: ApprovalStatus;
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
  @IsOptional()
  @IsBoolean()
  isRejected?: boolean;
}
