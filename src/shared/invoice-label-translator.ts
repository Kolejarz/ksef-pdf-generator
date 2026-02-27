import { Content } from 'pdfmake/interfaces';

const LABEL_TRANSLATIONS: Record<string, string> = {
  Sprzedawca: 'Seller',
  Nabywca: 'Buyer',
  Odbiorca: 'Recipient',
  Płatność: 'Payment',
  'Forma płatności': 'Payment method',
  'Termin płatności': 'Payment due date',
  'Data zapłaty': 'Payment date',
  'Zapłata częściowa': 'Partial payment',
  'Brak zapłaty': 'Unpaid',
  Zapłacono: 'Paid',
  'Numer rachunku bankowego': 'Bank account number',
  'Numer rachunku bankowego faktora': 'Factor bank account number',
  'Podsumowanie stawek podatku': 'Tax rate summary',
  'Stawka podatku': 'Tax rate',
  'Stawka podatku OSS': 'OSS tax rate',
  'Kwota netto': 'Net amount',
  'Kwota podatku': 'Tax amount',
  'Kwota brutto': 'Gross amount',
  'Kwota podatku PLN': 'Tax amount PLN',
  Szczegóły: 'Details',
  'Warunki transakcji': 'Transaction terms',
  Transport: 'Transport',
  Przewoźnik: 'Carrier',
  Rozliczenie: 'Settlement',
  Rabat: 'Discount',
  Zamówienie: 'Order',
  'Zamówienie przed korektą': 'Order before correction',
  'Zamówienie po korekcie': 'Order after correction',
  Tak: 'Yes',
  Nie: 'No',
};

export function translateInvoiceLabel(text: string): string {
  return Object.entries(LABEL_TRANSLATIONS).reduce(
    (result: string, [plLabel, enLabel]: [string, string]) => result.replaceAll(plLabel, enLabel),
    text
  );
}

export function translateInvoiceContent<T extends Content | Content[]>(content: T): T {
  if (Array.isArray(content)) {
    return content.map((item: Content): Content => translateInvoiceContent(item)) as T;
  }

  if (typeof content === 'string') {
    return translateInvoiceLabel(content) as T;
  }

  if (content && typeof content === 'object') {
    const result: Record<string, unknown> = { ...content };

    Object.keys(result).forEach((key: string): void => {
      if (key === 'text' && typeof result[key] === 'string') {
        result[key] = translateInvoiceLabel(result[key] as string);
      } else {
        const value: unknown = result[key];
        if (Array.isArray(value) || (value && typeof value === 'object')) {
          result[key] = translateInvoiceContent(value as Content | Content[]);
        }
      }
    });

    return result as T;
  }

  return content;
}
