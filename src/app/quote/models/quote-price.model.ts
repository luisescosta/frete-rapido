import {
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  Generated,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { QuoteModel } from './quote.model';

export interface QuotePricesSchema {
  id: number;
  name: string;
  price: number;
  service: string;
  deadline: number;
  quoteId: number;
  createdAt: string;
}

@Entity('quote_prices')
export class QuotePricesModel implements QuotePricesSchema {
  @PrimaryColumn({ name: 'id' })
  @Generated('increment')
  id!: number;

  @Column({ name: 'quote_id' })
  quoteId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'price' })
  price: number;

  @Column({ name: 'service' })
  service: string;

  @Column({ name: 'deadline' })
  deadline: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: string;

  @ManyToOne(() => QuoteModel, (quote) => quote.quotePrices)
  @JoinColumn({ name: 'quote_id', referencedColumnName: 'id' })
  quote: QuoteModel;
}
