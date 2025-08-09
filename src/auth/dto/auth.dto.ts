import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@ApiProperty({ required: false, example: 'Juice', type: String })
	@IsOptional()
	@IsString()
	name: string | undefined

	@ApiProperty({ required: false, example: 'juice@gmail.com', type: String, format: 'email' })
	@IsString({
		message: 'Email is required'
	})
	@IsEmail()
	email: string

	@ApiProperty({ required: true, example: '123456', type: String, format: "password" })
	@MinLength(6, {
		message: 'Password must be longer than 6 characters'
	})
	@IsString({
		message: 'Password is required'
	})
	password: string
}
