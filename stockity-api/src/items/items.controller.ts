import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemService: ItemsService) {}

  /**
   * Creates a new `Item`
   * @param createItemDto the required creation parameters from the request's body
   * @returns the `Item` object created in the database
   */
  @ApiCreatedResponse({
    description: 'The `Item` is successfully created.'
  })
  @ApiBody({
    type: CreateItemDto,
    description: 'Properties of the new `Item`'
  })
  @Post()
  create(@Body(ValidationPipe) createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  /**
   * Gets all the `Item`s
   * @returns all the `Item`s
   */
  @ApiOkResponse({
    description: 'All `Item`s are successfully fetched.'
  })
  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  /**
   * Gets a specific `Item` with a matching ID
   * @param id the ID of the `Item`
   * @returns the `Item` with the specific ID
   */
  @ApiOkResponse({
    description: 'The `Item` is successfully fetched.'
  })
  @ApiNotFoundResponse({ description: 'The `Item` cannot be found.' })
  @ApiParam({
    type: 'integer',
    name: 'id',
    description: 'The ID of the `Item`'
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.findOne(+id);
  }

  /**
   * Updates a specific `Item`'s properties
   * @param id the ID of the `Item` to update
   * @param updateItemDto the properties of the `Item` to update and their new values
   * @returns the result of the update
   */
  @ApiOkResponse({
    description: 'The `Item` is successfully updated.'
  })
  @ApiNotFoundResponse({ description: 'The `Item` cannot be found.' })
  @ApiParam({
    type: 'integer',
    name: 'id',
    description: 'The ID of the `Item`'
  })
  @ApiBody({
    type: UpdateItemDto,
    description: 'Properties of the `Item` to update and their new values'
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateItemDto: UpdateItemDto
  ) {
    return this.itemService.update(+id, updateItemDto);
  }

  /**
   * Removes an `Item` with a specific ID
   * @param id the ID of the `Item` to remove
   * @returns the result of the removal
   */
  @ApiOkResponse({
    description: 'The `Item` is successfully deleted.'
  })
  @ApiNotFoundResponse({ description: 'The `Item` cannot be found.' })
  @ApiParam({
    type: 'integer',
    name: 'id',
    description: 'The ID of the `Item`'
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.remove(+id);
  }
}
