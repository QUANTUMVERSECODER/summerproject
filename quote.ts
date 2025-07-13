
export interface Quote {
  id: number;
  text: string;
  author: string;
  category?: string;
}

export interface SearchResult {
  quote: Quote;
  highlightedText: string;
}

export type ViewMode = 'card' | 'list';
