export class Money {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number, currency: string = 'USD') {
    this.validateAmount(amount);
    this.validateCurrency(currency);
    this.amount = Math.round(amount * 100) / 100;
    this.currency = currency.toUpperCase();
  }

  private validateAmount(amount: number): void {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    if (!Number.isFinite(amount)) {
      throw new Error('Amount must be a finite number');
    }
  }

  private validateCurrency(currency: string): void {
    if (!currency || currency.trim().length !== 3) {
      throw new Error('Currency must be a valid ISO 4217 code (3 characters)');
    }
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public add(other: Money): Money {
    if (this.currency !== other.getCurrency()) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.getAmount(), this.currency);
  }

  public subtract(other: Money): Money {
    if (this.currency !== other.getCurrency()) {
      throw new Error('Cannot subtract money with different currencies');
    }
    return new Money(this.amount - other.getAmount(), this.currency);
  }

  public multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  public format(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }

  public equals(other: Money): boolean {
    return (
      this.amount === other.getAmount() && this.currency === other.getCurrency()
    );
  }
}
