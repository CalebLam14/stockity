import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/groups/entities/group.entity';
import { GroupsService } from 'src/groups/groups.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

/**
 * The `ItemsService` manages all product items.
 * Use the `items` endpoint to interact with it.
 */
@Injectable()
export class ItemsService {
  /**
   * Creates the `ItemsService`
   * @param itemsRepository the injected `Repository` of `Item`s coming from the database
   */
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>
  ) {}

  /**
   * Creates a new `Item` and saves it into the database
   * @param createItemDto the required creation parameters from the request's body
   * @returns the `Item` object created in the database
   */
  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = this.itemsRepository.create(createItemDto);
    return await this.itemsRepository.save(item);
  }

  /**
   * Gets all the `Item`s in the database
   * @returns all the `Item`s in the database
   */
  async findAll(): Promise<Item[]> {
    return await this.itemsRepository.find({ relations: ['group'] });
  }

  /**
   * Gets a specific `Item` with a matching ID
   * @param id the ID of the `Item`
   * @returns the `Item` with the specific ID
   */
  async findOne(id: number): Promise<Item> {
    return await this.itemsRepository
      .findOneOrFail(id, { relations: ['group'] })
      .catch(() => {
        throw new HttpException('Item not found!', HttpStatus.NOT_FOUND);
      });
  }

  /**
   * Modifies a specific `Item`'s properties
   * @param id the ID of the `Item` to modify
   * @param updateItemDto the properties of the `Item` to modify and their new values
   * @returns the result of the update
   */
  async update(
    id: number,
    updateItemDto: UpdateItemDto
  ): Promise<UpdateResult> {
    return await this.itemsRepository
      .findOneOrFail(id, { relations: ['group'] })
      .catch((r) => {
        console.log(r);
        throw new HttpException('Item not found!', HttpStatus.NOT_FOUND);
      })
      .then(() => this.itemsRepository.update({ id: id }, updateItemDto))
      .catch((r) => {
        console.log(r);
        throw new HttpException(
          'Something went wrong!',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }

  /**
   * Removes an `Item` with a specific ID from the database
   * @param id the ID of the `Item` to remove
   * @returns the result of the removal
   */
  async remove(id: number): Promise<DeleteResult> {
    return await this.itemsRepository
      .findOneOrFail(id, { relations: ['group'] })
      .then(() => this.itemsRepository.delete({ id: id }))
      .catch(() => {
        throw new HttpException('Item not found!', HttpStatus.NOT_FOUND);
      });
  }
}
