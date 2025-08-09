import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { ApiBearerAuth, ApiCookieAuth, ApiHeader } from "@nestjs/swagger";

export const Auth = () => applyDecorators(
	UseGuards(JwtAuthGuard),
	ApiHeader({ name: 'Authorization', required: true, example: 'Bearer <token>' }),
);