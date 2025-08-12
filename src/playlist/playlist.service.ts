import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client'
import { I18nContext } from 'nestjs-i18n';

type PlaylistWithTranslations = Prisma.PlaylistGetPayload<{
	include: { translations: true }
}>

@Injectable()
export class PlaylistService {
	lang: string;

	constructor(
		private prisma: PrismaService,
	) {
		this.lang = I18nContext.current()?.lang || 'en'
	}

	private getTranslatedPlaylist(playlist: PlaylistWithTranslations, lang: string) {
		return {
			...playlist,
			name: playlist.translations.find((t) => t.language === lang)?.name || playlist.name,
			description: playlist.translations.find((t) => t.language === lang)?.description || playlist.description,
		}
	}

	async getPublic() {
		const playlists = await this.prisma.playlist.findMany(
			{
				where: {
					isPublic: true
				},
				include: {
					translations: true
				}
			}
		);

		return playlists.map((playlist) => this.getTranslatedPlaylist(playlist, this.lang));
	}

	async getById(playlistId: string, userId: string) {
		const playlist = await this.prisma.playlist.findUnique({
			where: {
				id: playlistId,
				userId
			},
			include: {
				translations: true
			}
		})

		if (!playlist)
			throw new NotFoundException(
				'Playlist not found or you do not have access'
			)

		return this.getTranslatedPlaylist(playlist, this.lang)
	}

	async getByUserId(userId: string) {
		const playlists = await this.prisma.playlist.findMany({
			where: {
				userId
			},
			include: {
				translations: true
			}
		})

		if (!playlists)
			throw new NotFoundException(
				'No playlists found for this account'
			)

		return playlists.map((playlist) => this.getTranslatedPlaylist(playlist, this.lang))
	}


	async create(userId: string, dto: CreatePlaylistDto) {
		const playlist = await this.prisma.playlist.create({
			data: {
				name: dto.name,
				description: dto.description,
				isPublic: dto.isPublic,
				userId
			},
			include: {
				translations: true
			}
		});

		return this.getTranslatedPlaylist(playlist, this.lang)
	}

	async update(playlistId: string, userId: string, dto: UpdatePlaylistDto) {
		await this.getById(playlistId, userId)

		const playlist = await this.prisma.playlist.update({
			where: { id: playlistId },
			data: {
				...dto,
			},
			include: {
				translations: true
			}
		});

		return this.getTranslatedPlaylist(playlist, this.lang)
	}

	async delete(playlistId: string, userId: string) {
		await this.getById(playlistId, userId)

		const playlist = await this.prisma.playlist.delete({
			where: { id: playlistId },
			include: {
				translations: true
			}
		});

		return this.getTranslatedPlaylist(playlist, this.lang)
	}
}
