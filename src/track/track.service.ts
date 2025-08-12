import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TrackService {
	constructor(
		private prisma: PrismaService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) { }

	async getAll() {
		let tracks = await this.cacheManager.get('tracks');
		console.log('tracks from cache', tracks);
		if (!tracks) {
			tracks = await this.prisma.track.findMany()
			await this.cacheManager.set('tracks', tracks);
			console.log('tracks set in cache');
		};

		return tracks
	}

	async getById(trackId: string) {
		let track = await this.cacheManager.get(`track ${trackId}`);
		console.log('track from cache', track);

		if (!track) {
			track = await this.prisma.track.findUnique({
				where: {
					id: trackId,
				}
			});
			await this.cacheManager.set('tracks', track);
			console.log('track set in cache');
		};

		if (!track)
			throw new NotFoundException(
				'Track not found'
			)

		return track
	}


	async create(dto: CreateTrackDto) {
		return this.prisma.track.create({
			data: {
				name: dto.name,
				url: dto.url
			}
		})
	}

	async update(trackId: string, dto: UpdateTrackDto) {
		await this.getById(trackId)

		return this.prisma.track.update({
			where: { id: trackId },
			data: {
				...dto,
			}
		})
	}

	async delete(trackId: string) {
		await this.getById(trackId)

		return this.prisma.track.delete({
			where: { id: trackId }
		})
	}
}
