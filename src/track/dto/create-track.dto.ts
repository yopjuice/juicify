import { IsString, IsUrl, Max, Min } from "class-validator";

export class CreateTrackDto {
	@IsString()
	@Min(1)
	@Max(100)
	name: string;

	@IsString()
	@IsUrl()
	url: string

}