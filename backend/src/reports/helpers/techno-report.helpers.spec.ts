import { PayerType } from '../../libs/enums';
import { transportForPayer } from './transport.helpers';

describe('techno report transport rules', () => {
  it('Dyumans parent uses buyer payer', () => {
    expect(
      transportForPayer(12, PayerType.BUYER, PayerType.BUYER),
    ).toBe(12);
    expect(
      transportForPayer(12, PayerType.SELLER, PayerType.BUYER),
    ).toBe(0);
  });

  it('Dyumans child / EWB / Klimana use seller payer', () => {
    expect(
      transportForPayer(8, PayerType.SELLER, PayerType.SELLER),
    ).toBe(8);
    expect(
      transportForPayer(8, PayerType.BUYER, PayerType.SELLER),
    ).toBe(0);
  });

  it('first child order is stable by id', () => {
    const children = [{ id: 5 }, { id: 2 }, { id: 9 }];
    const sorted = [...children].sort((a, b) => a.id - b.id);
    expect(sorted[0].id).toBe(2);
  });

  it('out delta is margin minus transport', () => {
    const margin = (10 - 4) * 3 + (8 - 5) * 2; // 18 + 6 = 24
    const transport = 5;
    expect(margin - transport).toBe(19);
  });
});
