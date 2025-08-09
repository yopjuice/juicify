import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreatePlaylistDto {
	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	description: string | undefined;

	@IsBoolean()
	@IsOptional()
  isPublic: boolean | undefined;
}
