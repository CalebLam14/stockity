import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    ItemsModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3', // Normally, a hosted database would be used. sqlite3 is used for demo purposes only.
      database: '../data/stockity.db',
      synchronize: true, // This must be "false" in production. It is "true" for debugging purposes.
      autoLoadEntities: true
    }),
    GroupsModule
  ]
})
export class AppModule {}
