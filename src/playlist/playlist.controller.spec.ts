
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { PrismaService } from '../prisma/prisma.service';

describe('playlistController', () => {
  let playlistController: PlaylistController;
  let playlistService: PlaylistService;
	let onePlaylist;
	let arrayOfPlaylists;

	beforeAll(() => {
		onePlaylist = {
			id: '1',
			name: 'test playlist',
			isPublic: true,
			userId: '1',
			translations: [],
			createdAt: new Date(),
			updatedAt: new Date(),
			tracks: [],
			description: 'test description',
		};
		arrayOfPlaylists = [onePlaylist];
	});

  beforeEach(() => {
    playlistService = new PlaylistService(new PrismaService);
    playlistController = new PlaylistController(playlistService);
  });

  describe('findAll', () => {
    it('should return an array of playlist', async () => {
      const result = onePlaylist;
      jest.spyOn(playlistService, 'getPublic').mockImplementation(() => onePlaylist);

      expect(await playlistController.getPublic()).toBe(result);
    });
  });
});
