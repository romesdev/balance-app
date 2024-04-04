import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsPositive,
  Min,
} from 'class-validator';

export class RequestAccountDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsPositive()
  @Min(0.01)
  openingBalance: number;
}
