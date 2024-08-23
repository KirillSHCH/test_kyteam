import * as bcrypt from 'bcrypt';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { UserEntity } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>) {
    if (event.entity.password) {
      event.entity.password = await this.hashPassword(event.entity.password);
    }
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>) {
    const entity = event.entity as UserEntity;

    const passwordChanged = event.updatedColumns.find(
      (column) => column.propertyName === 'password',
    );

    if (passwordChanged) {
      entity.password = await this.hashPassword(entity.password);
    }
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hashSync(password, salt);
  }
}
