import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlaylistService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.playlist.findMany(
      {
        where: {
          isPublic: true
        }
      }
    )
  }

	async getById(playlistId: string, userId: string) {
		const playlist = await this.prisma.playlist.findUnique({
			where: {
				id: playlistId,
				userId
			}
		})

		if (!playlist)
			throw new NotFoundException(
				'Store not found or you do not have access'
			)

		return playlist
	}

	async getByUserId(userId: string) {
		const playlists = await this.prisma.playlist.findMany({
			where: {
				userId
			}
		})

		if (!playlists)
			throw new NotFoundException(
				'No playlists found for this account'
			)

		return playlists
	}


	async create(userId: string, dto: CreatePlaylistDto) {
		return this.prisma.playlist.create({
			data: {
				name: dto.name,
        description: dto.description,
        isPublic: dto.isPublic,
				userId
			}
		})
	}

	async update(playlistId: string, userId: string, dto: UpdatePlaylistDto) {
		await this.getById(playlistId, userId)

		return this.prisma.playlist.update({
			where: { id: playlistId },
			data: {
				...dto,
				userId
			}
		})
	}

	async delete(playlistId: string, userId: string) {
		await this.getById(playlistId, userId)

		return this.prisma.playlist.delete({
			where: { id: playlistId }
		})
	}
}
