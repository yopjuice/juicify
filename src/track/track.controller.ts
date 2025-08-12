import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TrackService } from './track.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Admin } from '../auth/decorators/admin.decorator';


@Admin()
@Auth()
@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) { }

  @Post()
  async create(@Body() dto: CreateTrackDto) {
    return await this.trackService.create(dto);
  }

  @Get()
  async getAll() {
    return await this.trackService.getAll();
  }


  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return await this.trackService.getById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return await this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.trackService.delete(id);
  }
}
