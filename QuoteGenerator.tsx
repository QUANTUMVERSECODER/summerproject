
import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Grid, List, Sparkles, Star } from 'lucide-react';
import { QuoteSearch } from '../utils/quoteSearch';
import { SearchBar } from './SearchBar';
import { QuoteCard } from './QuoteCard';
import { QuoteList } from './QuoteList';
import { Quote, ViewMode, SearchResult } from '../types/quote';

/**
 * Main QuoteGenerator component
 * Features:
 * - Trie-based search with real-time suggestions
 * - Toggle between card and list views
 * - Random quote generation
 * - Quote of the Day with localStorage
 * - Copy to clipboard functionality
 * - Responsive design with smooth animations
 */
export const QuoteGenerator: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [copiedQuoteId, setCopiedQuoteId] = useState<number | null>(null);
  const [quoteOfTheDay, setQuoteOfTheDay] = useState<Quote | null>(null);

  // Initialize QuoteSearch instance (memoized to prevent re-creation)
  const quoteSearch = useMemo(() => new QuoteSearch(), []);

  // Get search results and suggestions
  const searchResults: SearchResult[] = useMemo(() => {
    return quoteSearch.search(searchTerm);
  }, [quoteSearch, searchTerm]);

  const suggestions: string[] = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return quoteSearch.getSuggestions(searchTerm);
  }, [quoteSearch, searchTerm]);

  // Initialize quote of the day on component mount
  useEffect(() => {
    initializeQuoteOfTheDay();
  }, []);

  /**
   * Initialize or retrieve Quote of the Day from localStorage
   * Updates daily based on date comparison
   */
  const initializeQuoteOfTheDay = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('quoteOfTheDay');
    
    if (storedData) {
      try {
        const { quote, date } = JSON.parse(storedData);
        if (date === today) {
          setQuoteOfTheDay(quote);
          return;
        }
      } catch (error) {
        console.error('Error parsing stored quote of the day:', error);
      }
    }
    
    // Generate new quote of the day
    const newQuoteOfTheDay = quoteSearch.getRandomQuote();
    setQuoteOfTheDay(newQuoteOfTheDay);
    
    // Store in localStorage
    localStorage.setItem('quoteOfTheDay', JSON.stringify({
      quote: newQuoteOfTheDay,
      date: today
    }));
  };

  /**
   * Generate a random quote
   */
  const generateRandomQuote = () => {
    const randomQuote = quoteSearch.getRandomQuote();
    setCurrentQuote(randomQuote);
  };

  /**
   * Copy text to clipboard with visual feedback
   */
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      
      // Find the quote ID for visual feedback
      const quote = searchResults.find(result => 
        `"${result.quote.text}" - ${result.quote.author}` === text
      )?.quote;
      
      if (quote) {
        setCopiedQuoteId(quote.id);
        setTimeout(() => setCopiedQuoteId(null), 2000);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  /**
   * Handle suggestion click - sets search term and focuses on results
   */
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              Quote Generator
              <Sparkles className="h-8 w-8 text-primary" />
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover inspiring quotes with intelligent search powered by Trie data structure
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            {/* Random Quote Button */}
            <button
              onClick={generateRandomQuote}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Random Quote
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  viewMode === 'card'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid className="h-4 w-4" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quote of the Day */}
        {quoteOfTheDay && !searchTerm && (
          <section className="mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                Quote of the Day
              </h2>
            </div>
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-xl p-8 text-center">
              <blockquote className="text-xl leading-relaxed text-foreground mb-4 italic">
                "{quoteOfTheDay.text}"
              </blockquote>
              <cite className="text-muted-foreground font-medium text-lg">
                — {quoteOfTheDay.author}
              </cite>
              <button
                onClick={() => copyToClipboard(`"${quoteOfTheDay.text}" - ${quoteOfTheDay.author}`)}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Copy Quote of the Day
              </button>
            </div>
          </section>
        )}

        {/* Current Random Quote */}
        {currentQuote && (
          <section className="mb-12">
            <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-8 text-center">
              <blockquote className="text-xl leading-relaxed text-foreground mb-4 italic">
                "{currentQuote.text}"
              </blockquote>
              <cite className="text-muted-foreground font-medium text-lg">
                — {currentQuote.author}
              </cite>
              <button
                onClick={() => copyToClipboard(`"${currentQuote.text}" - ${currentQuote.author}`)}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Copy Quote
              </button>
            </div>
          </section>
        )}

        {/* Search Results */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              {searchTerm ? `Search Results (${searchResults.length})` : `All Quotes (${searchResults.length})`}
            </h2>
            {searchTerm && (
              <p className="text-sm text-muted-foreground">
                Powered by Trie data structure for efficient prefix searching
              </p>
            )}
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No quotes found matching "{searchTerm}"
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Try a different search term or browse all quotes
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((searchResult) => (
                    <QuoteCard
                      key={searchResult.quote.id}
                      searchResult={searchResult}
                      onCopy={copyToClipboard}
                      isCopied={copiedQuoteId === searchResult.quote.id}
                    />
                  ))}
                </div>
              ) : (
                <QuoteList
                  searchResults={searchResults}
                  onCopy={copyToClipboard}
                  copiedQuoteId={copiedQuoteId}
                />
              )}
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-muted-foreground text-sm">
            Built with React, TypeScript, and Trie data structure for efficient searching
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Features prefix-based search, real-time suggestions, and smart highlighting
          </p>
        </div>
      </footer>
    </div>
  );
};
