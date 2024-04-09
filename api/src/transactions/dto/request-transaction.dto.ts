import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class RequestTransactionDto {
  @IsNotEmpty()
  @IsPositive()
  @Min(0.01)
  value: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(150)
  description: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  accountId: number;
}
