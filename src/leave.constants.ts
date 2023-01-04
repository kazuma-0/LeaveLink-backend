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

export enum LeaveType {
  CASUAL = 'CASUAL',
  PERMISSION = 'PERMISSION',
  ON_DUTY = 'ON_DUTY',
  COMPENSATION = 'COMPENSATION',
}

export enum LeaveSession {
  FORENOON = 'FORENOON',
  AFTERNOON = 'AFTERNOON',
  FULLDAY = 'FULLDAY',
}

export enum ApprovalStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NOT_CHECKED = 'NOT_CHECKED',
  NO_PRIVILEGE = 'NO_PRIVILEGE',
  PENDING = 'PENDING',
}
