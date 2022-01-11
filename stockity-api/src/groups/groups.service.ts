import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

/**
 * The `GroupsService` manages all product groups.
 * Use the `groups` endpoint to interact with it.
 */
@Injectable()
export class GroupsService {
  /**
   * Creates the `GroupsService`
   * @param groupsRepository the injected `Repository` of `Group`s coming from the database
   */
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>
  ) {}

  /**
   * Creates a new `Group` and saves it into the database
   * @param createGroupDto the required creation parameters from the request's body
   * @returns the `Group` object created in the database
   */
  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupsRepository.create(createGroupDto);
    return await this.groupsRepository.save(group);
  }

  /**
   * Gets all the `Group`s in the database
   * @param showItems whether to list the `Item`s in the `Group`
   * @returns all the `Group`s in the database
   */
  async findAll(showItems: boolean): Promise<Group[]> {
    const relations = showItems ? ['items'] : [];
    return await this.groupsRepository.find({ relations: relations });
  }

  /**
   * Gets a specific `Group` with a matching ID
   * @param id the ID of the `Group`
   * @param showItems whether to list the `Item`s in the `Group`
   * @returns the `Group` with the specific ID
   */
  async findOne(id: number, showItems: boolean): Promise<Group> {
    const relations = showItems ? ['items'] : [];
    return await this.groupsRepository
      .findOneOrFail(id, { relations: relations })
      .catch(() => {
        throw new HttpException('Group not found!', HttpStatus.NOT_FOUND);
      });
  }

  /**
   * Modifies a specific `Group`'s properties
   * @param id the ID of the `Group` to modify
   * @param updateGroupDto the properties of the `Group` to modify and their new values
   * @returns the result of the update
   */
  async update(
    id: number,
    updateGroupDto: UpdateGroupDto
  ): Promise<UpdateResult> {
    return await this.groupsRepository
      .findOneOrFail(id, { relations: ['items'] })
      .then(() => this.groupsRepository.update({ id: id }, updateGroupDto))
      .catch(() => {
        throw new HttpException('Group not found!', HttpStatus.NOT_FOUND);
      });
  }

  /**
   * Removes an `Group` with a specific ID from the database
   * @param id the ID of the `Group` to remove
   * @returns the result of the removal
   */
  async remove(id: number): Promise<DeleteResult> {
    return await this.groupsRepository
      .findOneOrFail(id, { relations: ['items'] })
      .then(() => this.groupsRepository.delete({ id: id }))
      .catch(() => {
        throw new HttpException('Group not found!', HttpStatus.NOT_FOUND);
      });
  }
}
