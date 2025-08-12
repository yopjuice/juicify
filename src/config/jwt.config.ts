import { ConfigService } from "@nestjs/config";
import {JwtModuleOptions} from '@nestjs/jwt'

export const getJwtConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => ({
    secret: configService.getOrThrow('JWT_SECRET'),
})

export const getTestUserId = async (configService: ConfigService): Promise<string> => configService.getOrThrow('TEST_USER_ID')

export const getTestUser = () => (
    {
        id: 'TEST_USER_ID',
        email: 'TEST_USER_EMAIL',
        name: 'TEST_USER_NAME',
        picture: 'TEST_USER_PICTURE',
        role: 'ADMIN',
        product: 'FREE',
        playlists: [],
        playlistsLiked: [],
        tracksLiked: [],
        filter_enabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
)