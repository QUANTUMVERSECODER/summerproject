
/**
 * Trie Node class - represents each node in the Trie tree
 * Each node contains:
 * - children: Map of character to child nodes
 * - isEndOfWord: boolean indicating if this node represents end of a word
 * - quotes: array of quote IDs that contain words ending at this node
 */
export class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  quotes: Set<number>; // Store quote IDs instead of full quotes for efficiency

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.quotes = new Set();
  }
}

/**
 * Trie class - implements prefix tree for efficient text searching
 * Time Complexity:
 * - Insert: O(m) where m is word length
 * - Search: O(m) where m is prefix length
 * - Space: O(ALPHABET_SIZE * N * M) where N is number of words, M is average length
 */
export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Insert a word into the Trie with associated quote ID
   * @param word - word to insert (converted to lowercase)
   * @param quoteId - ID of the quote containing this word
   */
  insert(word: string, quoteId: number): void {
    let current = this.root;
    
    // Convert to lowercase for case-insensitive searching
    const normalizedWord = word.toLowerCase().replace(/[^\w]/g, '');
    
    // Traverse/create path for each character
    for (const char of normalizedWord) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
      // Add quote ID to each node in the path for partial matching
      current.quotes.add(quoteId);
    }
    
    // Mark end of word
    current.isEndOfWord = true;
  }

  /**
   * Search for words with given prefix
   * @param prefix - prefix to search for
   * @returns Set of quote IDs containing words with this prefix
   */
  search(prefix: string): Set<number> {
    if (!prefix.trim()) return new Set();
    
    let current = this.root;
    const normalizedPrefix = prefix.toLowerCase().replace(/[^\w]/g, '');
    
    // Navigate to the prefix node
    for (const char of normalizedPrefix) {
      if (!current.children.has(char)) {
        return new Set(); // Prefix not found
      }
      current = current.children.get(char)!;
    }
    
    // Return all quotes that contain words with this prefix
    return current.quotes;
  }

  /**
   * Get search suggestions based on prefix
   * @param prefix - prefix to get suggestions for
   * @param maxSuggestions - maximum number of suggestions to return
   * @returns array of suggested words
   */
  getSuggestions(prefix: string, maxSuggestions: number = 5): string[] {
    if (!prefix.trim()) return [];
    
    let current = this.root;
    const normalizedPrefix = prefix.toLowerCase().replace(/[^\w]/g, '');
    
    // Navigate to prefix node
    for (const char of normalizedPrefix) {
      if (!current.children.has(char)) {
        return [];
      }
      current = current.children.get(char)!;
    }
    
    // Collect words starting with this prefix using DFS
    const suggestions: string[] = [];
    this.collectWords(current, normalizedPrefix, suggestions, maxSuggestions);
    
    return suggestions;
  }

  /**
   * Helper method to collect words using Depth-First Search
   * @param node - current node
   * @param currentWord - word built so far
   * @param suggestions - array to store suggestions
   * @param maxSuggestions - maximum suggestions to collect
   */
  private collectWords(
    node: TrieNode, 
    currentWord: string, 
    suggestions: string[], 
    maxSuggestions: number
  ): void {
    if (suggestions.length >= maxSuggestions) return;
    
    if (node.isEndOfWord) {
      suggestions.push(currentWord);
    }
    
    // Explore all children
    for (const [char, childNode] of node.children) {
      this.collectWords(childNode, currentWord + char, suggestions, maxSuggestions);
    }
  }
}
