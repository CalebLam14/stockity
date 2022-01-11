import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../../groups/entities/group.entity';
import { Column } from 'typeorm';
import { IsString, IsInt, IsNumber, ValidateIf } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'The name of the product item',
    required: true,
    example: 'Orange Juice'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the product item',
    required: false,
    example:
      'A small bottle of orange juice. Nice and fresh with no artificial flavor!'
  })
  @IsString()
  description: string = '';

  @ApiProperty({
    description: 'The price of the product item',
    minimum: 0,
    required: false,
    type: Number,
    example: 0.99
  })
  @IsNumber()
  price: number = 0;

  @ApiProperty({
    description: 'The number of the product items available',
    minimum: 0,
    required: false,
    type: Number,
    example: 4000
  })
  @Column('integer')
  @IsInt()
  stock: number = 0;

  @ApiProperty({
    description: 'The ID of the product group the item belongs to',
    required: false,
    type: Number,
    example: 2
  })
  @Column({
    type: 'integer',
    nullable: true
  })
  @IsInt()
  @ValidateIf((_, val) => val != null)
  group!: Group | null;
}
