import {
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  Generated,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { QuotePricesModel } from './quote-price.model';

export interface QuoteSchema {
  id: number;
  createdAt: string;
}

@Entity('quotes')
export class QuoteModel implements QuoteSchema {
  @PrimaryColumn({ name: 'id' })
  @Generated('increment')
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: string;

  @OneToMany(() => QuotePricesModel, (quotePrices) => quotePrices.quote)
  @JoinColumn()
  quotePrices: QuotePricesModel[];
}
