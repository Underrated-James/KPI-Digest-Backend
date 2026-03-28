import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from '../api/dto/request/create-team.dto';
import { PatchTeamDto } from '../api/dto/request/patch-team.dto';

@Injectable()
export class TeamsService {
  create(_createTeamDto: CreateTeamDto) {
    return 'This action adds a new team';
  }

  findAll() {
    return `This action returns all teams`;
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, _updateTeamDto: PatchTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
