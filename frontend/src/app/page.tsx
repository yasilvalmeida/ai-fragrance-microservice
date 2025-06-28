'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Sparkles, ShoppingBag, Users, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import FragranceForm from '@/components/FragranceForm';
import FragranceResults from '@/components/FragranceResults';
import {
  FragranceRequest,
  FragranceResponse,
  CheckoutItem,
} from '@/types/fragrance';
import { fragranceApi } from '@/services/api';

export default function HomePage() {
  const [results, setResults] = useState<FragranceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);
  const router = useRouter();

  const handleFormSubmit = async (data: FragranceRequest) => {
    setIsLoading(true);
    try {
      const response = await fragranceApi.getRecommendations(data);
      setResults(response);
      toast.success('Got your perfect fragrance matches!');

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to get recommendations'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (item: CheckoutItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        toast.success('Item already in cart!');
        return prev;
      }
      toast.success(`Added ${item.name} to cart!`);
      return [...prev, item];
    });
  };

  const goToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Add some items to your cart first!');
      return;
    }

    // Store cart items in localStorage for the checkout page
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    router.push('/checkout');
  };

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20'>
        <div className='absolute inset-0 bg-black/20'></div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-5xl md:text-6xl font-bold mb-6'>
            Find Your Perfect Fragrance
          </h1>
          <p className='text-xl md:text-2xl mb-8 text-blue-100'>
            Let AI analyze your preferences and discover fragrances that match
            your unique personality
          </p>
          <div className='flex flex-wrap justify-center gap-6 text-sm'>
            <div className='flex items-center'>
              <Brain className='w-5 h-5 mr-2' />
              <span>AI-Powered Matching</span>
            </div>
            <div className='flex items-center'>
              <Sparkles className='w-5 h-5 mr-2' />
              <span>Personalized Recommendations</span>
            </div>
            <div className='flex items-center'>
              <Award className='w-5 h-5 mr-2' />
              <span>Expert Curation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <FragranceForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      </section>

      {/* Results Section */}
      {results && (
        <section
          id='results'
          className='py-16 px-4 sm:px-6 lg:px-8 bg-white/50'
        >
          <FragranceResults results={results} onAddToCart={handleAddToCart} />

          {/* Cart and Checkout */}
          {cartItems.length > 0 && (
            <div className='max-w-4xl mx-auto mt-12'>
              <div className='card'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <ShoppingBag className='w-6 h-6 text-primary-600' />
                    <div>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        Cart ({cartItems.length} item
                        {cartItems.length !== 1 ? 's' : ''})
                      </h3>
                      <p className='text-gray-600'>
                        Total: $
                        {cartItems.reduce(
                          (total, item) => total + item.price,
                          0
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={goToCheckout}
                    className='btn-primary text-lg px-6 py-3'
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* How It Works Section */}
      <section id='how-it-works' className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              How It Works
            </h2>
            <p className='text-xl text-gray-600'>
              Our AI analyzes your preferences to find your perfect fragrance
              match
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Users className='w-8 h-8 text-primary-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                1. Tell Us About You
              </h3>
              <p className='text-gray-600'>
                Share your fragrance preferences, personality, and what
                occasions you'll wear it for
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Brain className='w-8 h-8 text-primary-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                2. AI Analysis
              </h3>
              <p className='text-gray-600'>
                Our AI processes your preferences and matches them with
                thousands of fragrances
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Sparkles className='w-8 h-8 text-primary-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                3. Get Your Matches
              </h3>
              <p className='text-gray-600'>
                Receive personalized recommendations with detailed explanations
                of why they suit you
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
