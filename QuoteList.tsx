
import React from 'react';
import { Copy, Check } from 'lucide-react';
import { SearchResult } from '../types/quote';

interface QuoteListProps {
  searchResults: SearchResult[];
  onCopy: (text: string) => void;
  copiedQuoteId: number | null;
}

/**
 * QuoteList component - displays quotes in compact list format
 * Features:
 * - Compact layout for viewing more quotes at once
 * - Highlighted search matches
 * - Individual copy buttons for each quote
 * - Alternating row colors for better readability
 */
export const QuoteList: React.FC<QuoteListProps> = ({
  searchResults,
  onCopy,
  copiedQuoteId
}) => {
  return (
    <div className="space-y-2">
      {searchResults.map((searchResult, index) => {
        const { quote, highlightedText } = searchResult;
        const isCopied = copiedQuoteId === quote.id;

        return (
          <div
            key={quote.id}
            className={`group flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-all duration-200 ${
              index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
            }`}
          >
            {/* Quote Content */}
            <div className="flex-1 min-w-0">
              <div className="text-foreground mb-2">
                <span 
                  dangerouslySetInnerHTML={{ __html: `"${highlightedText}"` }}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-medium">
                  — {quote.author}
                </span>
                {quote.category && (
                  <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                    {quote.category}
                  </span>
                )}
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={() => onCopy(`"${quote.text}" - ${quote.author}`)}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-2 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-all duration-200 focus:opacity-100 flex-shrink-0"
              title="Copy quote"
            >
              {isCopied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};
