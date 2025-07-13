
import { Trie } from './trie';
import { quotes } from '../data/quotes';
import { Quote, SearchResult } from '../types/quote';

/**
 * QuoteSearch class - manages Trie-based searching for quotes
 * Provides efficient prefix-based search with highlighting
 */
export class QuoteSearch {
  private trie: Trie;
  private quotesMap: Map<number, Quote>;

  constructor() {
    this.trie = new Trie();
    this.quotesMap = new Map();
    this.initializeTrie();
  }

  /**
   * Initialize the Trie with all quotes
   * Breaks down each quote into words and inserts them into the Trie
   */
  private initializeTrie(): void {
    quotes.forEach(quote => {
      // Store quote in map for quick lookup
      this.quotesMap.set(quote.id, quote);
      
      // Extract words from quote text and author
      const words = this.extractWords(quote.text + ' ' + quote.author);
      
      // Insert each word into the Trie
      words.forEach(word => {
        if (word.length > 1) { // Only index words longer than 1 character
          this.trie.insert(word, quote.id);
        }
      });
    });
  }

  /**
   * Extract words from text, removing punctuation and converting to lowercase
   * @param text - text to extract words from
   * @returns array of cleaned words
   */
  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
      .split(/\s+/) // Split on whitespace
      .filter(word => word.length > 0); // Remove empty strings
  }

  /**
   * Search for quotes containing words with the given prefix
   * @param searchTerm - search term/prefix
   * @returns array of SearchResult objects with highlighted text
   */
  search(searchTerm: string): SearchResult[] {
    if (!searchTerm.trim()) {
      return quotes.map(quote => ({
        quote,
        highlightedText: quote.text
      }));
    }

    // Get quote IDs that match the search term
    const matchingQuoteIds = this.trie.search(searchTerm);
    
    // Convert to SearchResult objects with highlighting
    const results: SearchResult[] = [];
    
    matchingQuoteIds.forEach(quoteId => {
      const quote = this.quotesMap.get(quoteId);
      if (quote) {
        results.push({
          quote,
          highlightedText: this.highlightMatches(quote.text, searchTerm)
        });
      }
    });

    return results;
  }

  /**
   * Get search suggestions based on prefix
   * @param prefix - prefix to get suggestions for
   * @returns array of suggested search terms
   */
  getSuggestions(prefix: string): string[] {
    return this.trie.getSuggestions(prefix, 5);
  }

  /**
   * Highlight matching words in the quote text
   * @param text - original quote text
   * @param searchTerm - term to highlight
   * @returns text with HTML highlighting
   */
  private highlightMatches(text: string, searchTerm: string): string {
    if (!searchTerm.trim()) return text;
    
    const normalizedSearch = searchTerm.toLowerCase().replace(/[^\w]/g, '');
    const words = text.split(/(\s+)/); // Split but keep separators (spaces)
    
    return words.map(word => {
      const normalizedWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (normalizedWord.startsWith(normalizedSearch) && normalizedWord.length > 0) {
        return `<mark class="bg-yellow-200 px-1 rounded">${word}</mark>`;
      }
      return word;
    }).join('');
  }

  /**
   * Get a random quote
   * @returns random Quote object
   */
  getRandomQuote(): Quote {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  /**
   * Get all quotes
   * @returns array of all quotes
   */
  getAllQuotes(): Quote[] {
    return quotes;
  }
}
