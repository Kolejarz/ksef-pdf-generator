import { describe, expect, it } from 'vitest';
import { translateInvoiceContent, translateInvoiceLabel } from './invoice-label-translator';

describe('invoice-label-translator', () => {
  it('translates single labels to English', () => {
    expect(translateInvoiceLabel('Sprzedawca')).toBe('Seller');
    expect(translateInvoiceLabel('Podsumowanie stawek podatku')).toBe('Tax rate summary');
  });

  it('translates nested pdfmake content text fields', () => {
    const content: any = [
      { text: 'Sprzedawca' },
      {
        columns: [{ text: 'Nabywca' }, { stack: [{ text: 'Płatność' }, { text: 'Tak' }] }],
      },
    ];

    const result = translateInvoiceContent(content);

    expect(result[0].text).toBe('Seller');
    expect(result[1].columns[0].text).toBe('Buyer');
    expect(result[1].columns[1].stack[0].text).toBe('Payment');
    expect(result[1].columns[1].stack[1].text).toBe('Yes');
  });
});
