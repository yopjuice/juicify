import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
    EXPIRE_DAY_REFRESH_TOKEN = 1
    REFRESH_TOKEN_NAME = 'refreshToken'

    constructor(
        private jwt: JwtService,
        private userService: UserService,
        private prisma: PrismaService,
        private configService: ConfigService
    ) { }

    async login(dto: AuthDto) {
        const user = await this.validateUser(dto)

        const tokens = this.issueTokens(user.id)

        return { user, ...tokens }
    }

    async register(dto: AuthDto) {
        const oldUser = await this.userService.getByEmail(dto.email)

        if (oldUser)
            throw new BadRequestException('User with this email already exists')

        const user = await this.userService.create(dto)

        const tokens = this.issueTokens(user.id)

        return { user, ...tokens }
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken)

        if (!result) throw new UnauthorizedException('Invalid refresh token')

        const user = await this.userService.getById(result.id);

        if (!user) throw new UnauthorizedException('Invalid refresh token')
        const tokens = this.issueTokens(user.id)

        return { user, ...tokens }
    }

    issueTokens(userId: string) {
        const data = { id: userId }

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h'
        })

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d'
        })

        return { accessToken, refreshToken }
    }

    private async validateUser(dto: AuthDto) {
        const user = await this.userService.getByEmail(dto.email)

        if (!user) throw new NotFoundException('User not found')

        return user
    }

    async validateOAuthLogin(req: any) {
        let user = await this.userService.getByEmail(req.user.email)

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: req.user.email,
                    name: req.user.name,
                    picture: req.user.picture
                },
                include: {
                    playlists: true,
                    playlistsLiked: true,
                    tracksLiked: true
                }
            });
        }

        const tokens = this.issueTokens(user.id)

        return { user, ...tokens }
    }

    addRefreshTokenToResponse(res: Response, refreshToken: string) {
        const expiresIn = new Date()
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            domain: this.configService.getOrThrow('SERVER_DOMAIN'),
            expires: expiresIn,
            secure: false,
            sameSite: 'lax'
        })
    }

    removeRefreshTokenFromResponse(res: Response) {
        res.cookie(this.REFRESH_TOKEN_NAME, '', {
            httpOnly: true,
            domain: this.configService.getOrThrow('SERVER_DOMAIN'),
            expires: new Date(0),
            secure: false,
            sameSite: 'lax'
        })
    }
}
