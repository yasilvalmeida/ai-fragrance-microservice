'use client';

import { useState } from 'react';
import {
  Star,
  Clock,
  Zap,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  FragranceResponse,
  FragranceRecommendation,
  CheckoutItem,
} from '@/types/fragrance';

interface FragranceResultsProps {
  results: FragranceResponse;
  onAddToCart: (item: CheckoutItem) => void;
}

export default function FragranceResults({
  results,
  onAddToCart,
}: FragranceResultsProps) {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const toggleCard = (index: number) => {
    setExpandedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const extractPrice = (priceRange: string): number => {
    const match = priceRange.match(/\$(\d+)/);
    return match ? parseInt(match[1], 10) : 75; // Default price
  };

  const handleAddToCart = (fragrance: FragranceRecommendation) => {
    const item: CheckoutItem = {
      id: `${fragrance.brand}-${fragrance.name}`
        .toLowerCase()
        .replace(/\s+/g, '-'),
      name: fragrance.name,
      brand: fragrance.brand,
      price: extractPrice(fragrance.priceRange),
      size: '50ml',
    };
    onAddToCart(item);
  };

  if (!results) {
    return null;
  }

  return (
    <div className='max-w-7xl mx-auto space-y-8 animate-fade-in'>
      {/* Analysis Section */}
      <div className='card'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Your Fragrance Profile
        </h2>
        <p className='text-gray-700 text-lg leading-relaxed'>
          {results.analysis}
        </p>

        <div className='mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
          <h3 className='font-semibold text-blue-900 mb-2'>💡 Expert Tips</h3>
          <p className='text-blue-800'>{results.tips}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-6 text-center'>
          Your Perfect Fragrance Matches
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {results.recommendations.map((fragrance, index) => (
            <div key={index} className='fragrance-card animate-slide-up'>
              {/* Header */}
              <div className='text-center mb-4'>
                <h3 className='text-xl font-bold text-gray-900'>
                  {fragrance.name}
                </h3>
                <p className='text-primary-600 font-medium'>
                  {fragrance.brand}
                </p>
                <div className='flex items-center justify-center mt-2 space-x-4 text-sm text-gray-600'>
                  <span className='flex items-center'>
                    <Clock className='w-4 h-4 mr-1' />
                    {fragrance.longevity}
                  </span>
                  <span className='flex items-center'>
                    <Zap className='w-4 h-4 mr-1' />
                    {fragrance.projection}
                  </span>
                </div>
              </div>

              {/* Price and Rating */}
              <div className='flex items-center justify-between mb-4'>
                <span className='text-2xl font-bold text-gray-900'>
                  {fragrance.priceRange}
                </span>
                <div className='flex items-center'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className='ml-1 text-sm text-gray-600'>(4.0)</span>
                </div>
              </div>

              {/* Description */}
              <p className='text-gray-700 mb-4 line-clamp-3'>
                {fragrance.description}
              </p>

              {/* Match Reason */}
              <div className='mb-4 p-3 bg-green-50 rounded-lg border border-green-200'>
                <h4 className='font-semibold text-green-900 text-sm mb-1'>
                  Why this matches you:
                </h4>
                <p className='text-green-800 text-sm'>
                  {fragrance.matchReason}
                </p>
              </div>

              {/* Expandable Notes Section */}
              <div className='border-t pt-4'>
                <button
                  onClick={() => toggleCard(index)}
                  className='flex items-center justify-between w-full text-left'
                  aria-label={`${
                    expandedCards.includes(index) ? 'Hide' : 'Show'
                  } fragrance notes`}
                >
                  <span className='font-medium text-gray-900'>
                    Fragrance Notes
                  </span>
                  {expandedCards.includes(index) ? (
                    <ChevronUp className='w-4 h-4 text-gray-500' />
                  ) : (
                    <ChevronDown className='w-4 h-4 text-gray-500' />
                  )}
                </button>

                {expandedCards.includes(index) && (
                  <div className='mt-3 space-y-3 animate-slide-up'>
                    <div>
                      <h5 className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
                        Top Notes
                      </h5>
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {fragrance.topNotes.map((note, noteIndex) => (
                          <span
                            key={noteIndex}
                            className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
                        Heart Notes
                      </h5>
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {fragrance.heartNotes.map((note, noteIndex) => (
                          <span
                            key={noteIndex}
                            className='px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full'
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
                        Base Notes
                      </h5>
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {fragrance.baseNotes.map((note, noteIndex) => (
                          <span
                            key={noteIndex}
                            className='px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full'
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(fragrance)}
                className='w-full mt-6 btn-primary flex items-center justify-center space-x-2'
              >
                <ShoppingCart className='w-4 h-4' />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Timestamp */}
      <div className='text-center text-sm text-gray-500'>
        Generated on {new Date(results.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
