import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @Auth()
  async create(@Body() dto: CreatePlaylistDto, @CurrentUser('id') userId: string) {
    return await this.playlistService.create(userId, dto);
  }

  @Get()
  async getPublic() {
    return await this.playlistService.getPublic();
  }

  @Get('my')
  @Auth()
  async getMy(@CurrentUser('id') userId: string) {
    return await this.playlistService.getByUserId(userId);
  }

  @Get('by-id/:id')
  @Auth()
  async getById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return await this.playlistService.getById(id, userId);
  }

  @Patch(':id')
  @Auth()
  async update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto, @CurrentUser('id') userId: string) {
    return await this.playlistService.update(id, userId, updatePlaylistDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return await this.playlistService.delete(id, userId);
  }
}
