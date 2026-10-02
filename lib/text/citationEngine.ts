export interface CitationInput {
  authorLast: string;
  authorFirst: string;
  title: string;
  websiteOrPublisher: string;
  year: string;
  url?: string;
  type: 'website' | 'book' | 'article' | 'journal';
}

export function formatCitation(input: CitationInput, style: 'APA' | 'MLA' | 'Harvard' | 'IEEE' | 'BibTeX'): string {
  const { authorLast, authorFirst, title, websiteOrPublisher, year, url, type } = input;

  const firstInit = authorFirst ? authorFirst.charAt(0).toUpperCase() + '.' : '';

  switch (style) {
    case 'APA':
      return `${authorLast}, ${firstInit} (${year}). ${title}. ${websiteOrPublisher}. ${url ? `Retrieved from ${url}` : ''}`.trim();

    case 'MLA':
      return `${authorLast}, ${authorFirst}. "${title}." ${websiteOrPublisher}, ${year}, ${url || ''}.`.trim();

    case 'Harvard':
      return `${authorLast}, ${firstInit} ${year}, ${title}, ${websiteOrPublisher}, viewed ${new Date().toLocaleDateString()}.`.trim();

    case 'IEEE':
      return `[1] ${firstInit} ${authorLast}, "${title}," ${websiteOrPublisher}, ${year}. [Online]. Available: ${url || 'N/A'}`;

    case 'BibTeX':
      const citeKey = `${authorLast.toLowerCase()}${year}`;
      return `@misc{${citeKey},\n  author = {${authorLast}, ${authorFirst}},\n  title = {${title}},\n  year = {${year}},\n  publisher = {${websiteOrPublisher}},\n  url = {${url || ''}}\n}`;

    default:
      return `${authorLast}, ${authorFirst} (${year}). ${title}.`;
  }
}
