import { PlaylistService } from './playlist.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { after } from 'node:test';
import { NotFoundException } from '@nestjs/common';

describe('PlaylistService', () => {
  let playlistService: PlaylistService;
  let prismaService: PrismaService;
	let userService: UserService;
	let userId: string;

	const playlist = {
      name: 'Test Playlist',
      description: 'This is a test playlist',
			isPublic: true
    };

	beforeAll(async () => {
		prismaService = new PrismaService();
    playlistService = new PlaylistService(prismaService);
		userService = new UserService(prismaService);

		const testUser = await userService.create({name: 'test', email: 'test', password: 'test'});
		userId = testUser.id;
	})


  it('should create a new playlist', async () => {
    

    const createdPlaylist = await playlistService.create(userId, playlist);
    expect(createdPlaylist).toHaveProperty('id');
    expect(createdPlaylist.name).toBe(playlist.name);
    expect(createdPlaylist.description).toBe(playlist.description);
		expect(createdPlaylist.isPublic).toBe(playlist.isPublic);
		expect(createdPlaylist.userId).toBe(userId);
  });

  it('should get a playlist by id', async () => {

    const createdPlaylist = await playlistService.create(userId, playlist);
    const retrievedPlaylist = await playlistService.getById(createdPlaylist.id, userId);
    expect(retrievedPlaylist).toHaveProperty('id');
    expect(retrievedPlaylist.name).toBe(playlist.name);
    expect(retrievedPlaylist.description).toBe(playlist.description);
		expect(retrievedPlaylist.isPublic).toBe(playlist.isPublic);
		expect(retrievedPlaylist.userId).toBe(userId);
  });

  it('should update a playlist', async () => {

    const createdPlaylist = await playlistService.create(userId, playlist);
    const updatedPlaylist = {
      name: 'Updated Playlist',
      description: 'This is an updated playlist',
    };

    await playlistService.update(createdPlaylist.id, userId, updatedPlaylist);
    const retrievedPlaylist = await playlistService.getById(createdPlaylist.id, userId);
    expect(retrievedPlaylist).toHaveProperty('id');
    expect(retrievedPlaylist.name).toBe(updatedPlaylist.name);
    expect(retrievedPlaylist.description).toBe(updatedPlaylist.description);
  });

  it('should delete a playlist', async () => {


    const createdPlaylist = await playlistService.create(userId, playlist);
    await playlistService.delete(createdPlaylist.id, userId);
    try {
			await playlistService.getById(createdPlaylist.id, userId);
		} catch (error) {
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toBe('Playlist not found or you do not have access');
		}
  });

	afterEach(async () => {
		await prismaService.playlist.deleteMany({where: {userId}});
	})

	afterEach(async () => {
		const playlists = await prismaService.playlist.deleteMany({
			where: {
				userId
			}
		});
	})
	afterAll(async () => {
		await userService.delete(userId);
	})
});