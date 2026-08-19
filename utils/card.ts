export function getCardCompanyColor(cardCompany: string): string {
  const company = cardCompany.toUpperCase();

  if (company.includes('KB') || company.includes('국민')) return 'bg-yellow';
  if (company.includes('신한')) return 'bg-deep-blue';
  if (company.includes('삼성')) return 'bg-blue';
  if (company.includes('현대')) return 'bg-gray-900';
  if (company.includes('롯데') || company.includes('BC') || company.includes('비씨')) return 'bg-red';
  if (company.includes('우리')) return 'bg-sky-09';
  if (company.includes('하나')) return 'bg-deep-green';
  if (company.includes('NH') || company.includes('농협')) return 'bg-orange';
  if (company.includes('카카오')) return 'bg-yellow-08';

  return 'bg-dm-gray-dark';
}
