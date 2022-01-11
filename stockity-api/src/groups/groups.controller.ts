import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  ValidationPipe,
  ParseBoolPipe
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  /**
   * Creates a new `Group`
   * @param createGroupDto the required creation parameters from the request's body
   * @returns the `Group` object created in the database
   */
  @ApiCreatedResponse({
    description: 'The `Group` is successfully created.'
  })
  @ApiBody({
    type: CreateGroupDto,
    description: 'Properties of the new `Group`'
  })
  @Post()
  create(@Body(ValidationPipe) createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  /**
   * Gets all the `Group`s
   * @param showItems whether to list the `Item`s in the `Group`
   * @returns all the `Group`s
   */
  @ApiOkResponse({
    description: 'All `Group`s are successfully fetched.'
  })
  @ApiQuery({
    name: 'show_items',
    required: false
  })
  @Get()
  findAll(
    @Query('show_items', new DefaultValuePipe(false), ParseBoolPipe)
    showItems: boolean
  ) {
    return this.groupsService.findAll(showItems);
  }

  /**
   * Gets a specific `Group` with a matching ID
   * @param id the ID of the `Group`
   * @param showItems whether to list the `Item`s in the `Group`
   * @returns the `Group` with the specific ID
   */
  @ApiOkResponse({
    description: 'The `Group` is successfully fetched.'
  })
  @ApiNotFoundResponse({ description: 'The `Group` cannot be found.' })
  @ApiParam({ name: 'id', description: 'The ID of the `Group`' })
  @ApiQuery({
    name: 'show_items',
    required: false
  })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('show_items', new DefaultValuePipe(false), ParseBoolPipe)
    showItems: boolean
  ) {
    return this.groupsService.findOne(+id, showItems);
  }

  /**
   * Updates a specific `Group`'s properties
   * @param id the ID of the `Group` to update
   * @param updateGroupDto the properties of the `Group` to update and their new values
   * @returns the result of the update
   */
  @ApiOkResponse({
    description: 'The `Group` is successfully updated.'
  })
  @ApiNotFoundResponse({ description: 'The `Group` cannot be found.' })
  @ApiParam({ name: 'id', description: 'The ID of the `Group`' })
  @ApiBody({
    type: UpdateGroupDto,
    description: 'Properties of the `Group` to update and their new values'
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateGroupDto: UpdateGroupDto
  ) {
    return this.groupsService.update(+id, updateGroupDto);
  }

  /**
   * Removes an `Group` with a specific ID
   * @param id the ID of the `Group` to remove
   * @returns the result of the removal
   */
  @ApiOkResponse({
    description: 'The `Group` is successfully deleted.'
  })
  @ApiNotFoundResponse({ description: 'The `Group` cannot be found.' })
  @ApiParam({ name: 'id', description: 'The ID of the `Group`' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.remove(+id);
  }
}
