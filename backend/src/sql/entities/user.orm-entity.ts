import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserOrmEntity {
  constructor(props: Partial<UserOrmEntity>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id!: string;

  @Column()
  email!: string;

  @Column()
  hashedPassword!: string;

  @Column({ type: 'text', nullable: true })
  token!: string | null;
}
