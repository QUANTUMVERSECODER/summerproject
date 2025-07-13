import React from 'react';
import { Copy, Check } from 'lucide-react';
import { SearchResult } from '../types/quote';

interface QuoteCardProps {
  searchResult: SearchResult;
  onCopy: (text: string) => void;
  isCopied: boolean;
}

/**
 * QuoteCard component - displays a quote in card format
 * Features:
 * - Highlighted search matches using dangerouslySetInnerHTML
 * - Copy to clipboard functionality
 * - Smooth hover animations
 * - Responsive design
 */
export const QuoteCard: React.FC<QuoteCardProps> = ({
  searchResult,
  onCopy,
  isCopied
}) => {
  const { quote, highlightedText } = searchResult;

  const handleCopy = () => {
    onCopy(`"${quote.text}" - ${quote.author}`);
  };

  return (
    <div className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Quote Text */}
      <blockquote className="text-lg leading-relaxed text-foreground mb-4">
        <span 
          className="italic"
          dangerouslySetInnerHTML={{ __html: `"${highlightedText}"` }}
        />
      </blockquote>

      {/* Author and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <cite className="text-muted-foreground font-medium">
            — {quote.author}
          </cite>
          {quote.category && (
            <span className="inline-block ml-3 px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
              {quote.category}
            </span>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-all duration-200 focus:opacity-100"
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
    </div>
  );
};
