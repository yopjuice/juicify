import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {hash} from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            },
           include: {
                playlists: true,
                playlistsLiked: true,
                tracksLiked: true,
            }
        });
        return user;
    }

    async getByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
            include: {
                playlists: true,
                playlistsLiked: true,
                tracksLiked: true,
            }
        });
        return user;
    }

    async create(dto: AuthDto) {
        return this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: await hash(dto.password),
            }
        })
    }

    async toggleLikedPlaylist(playlistId: string, userId: string) {
        const user = await this.getById(userId);
        const isLiked = user?.playlistsLiked.some(playlist => playlist.id === playlistId)
        this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                playlistsLiked: {
                    [isLiked ?  'disconnect' : 'connect']: {
                        id: playlistId
                    }
                }
            }
        });

        return true;
    }

    async toggleLikedTrack(trackId: string, userId: string) {
        const user = await this.getById(userId);
        const isLiked = user?.tracksLiked.some(playlist => playlist.id === trackId)
        this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                tracksLiked: {
                    [isLiked ?  'disconnect' : 'connect']: {
                        id: trackId
                    }
                }
            }
        });

        return true;
    }
}
