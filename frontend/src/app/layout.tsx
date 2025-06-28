import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Fragrance Match | Find Your Perfect Scent',
  description:
    'Discover your perfect fragrance with AI-powered recommendations based on your preferences and personality.',
  keywords: 'fragrance, perfume, AI, recommendations, scent matching',
  authors: [{ name: 'AI Fragrance Match' }],
  openGraph: {
    title: 'AI Fragrance Match | Find Your Perfect Scent',
    description:
      'Discover your perfect fragrance with AI-powered recommendations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <div className='min-h-screen'>
          <header className='bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='flex justify-between items-center h-16'>
                <div className='flex items-center'>
                  <h1 className='text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent'>
                    AI Fragrance Match
                  </h1>
                </div>
                <nav className='flex space-x-8'>
                  <a
                    href='/'
                    className='text-gray-700 hover:text-primary-600 transition-colors'
                  >
                    Home
                  </a>
                  <a
                    href='/#how-it-works'
                    className='text-gray-700 hover:text-primary-600 transition-colors'
                  >
                    How It Works
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className='bg-gray-900 text-white py-12 mt-20'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div>
                  <h3 className='text-lg font-semibold mb-4'>
                    AI Fragrance Match
                  </h3>
                  <p className='text-gray-400'>
                    Discover your perfect fragrance with AI-powered
                    recommendations tailored to your unique preferences.
                  </p>
                </div>
                <div>
                  <h4 className='text-md font-semibold mb-4'>Features</h4>
                  <ul className='space-y-2 text-gray-400'>
                    <li>AI-Powered Matching</li>
                    <li>Personalized Recommendations</li>
                    <li>Expert Curation</li>
                    <li>Detailed Analysis</li>
                  </ul>
                </div>
                <div>
                  <h4 className='text-md font-semibold mb-4'>About</h4>
                  <p className='text-gray-400'>
                    Built with Next.js and NestJS, powered by OpenAI for
                    intelligent fragrance recommendations.
                  </p>
                </div>
              </div>
              <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
                <p>
                  &copy; 2024 AI Fragrance Match. Built for demonstration
                  purposes.
                </p>
              </div>
            </div>
          </footer>
        </div>

        <Toaster
          position='top-right'
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            },
          }}
        />
      </body>
    </html>
  );
}
