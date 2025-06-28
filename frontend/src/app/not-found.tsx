import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        <div className='mb-8'>
          <h1 className='text-9xl font-bold text-primary-200 mb-4'>404</h1>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Fragrance Not Found
          </h2>
          <p className='text-gray-600 text-lg mb-8'>
            Looks like this scent has evaporated! The page you're looking for
            doesn't exist.
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            href='/'
            className='btn-primary inline-flex items-center space-x-2 w-full justify-center'
          >
            <Home className='w-4 h-4' />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className='btn-secondary inline-flex items-center space-x-2 w-full justify-center'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Go Back</span>
          </button>
        </div>

        <div className='mt-12 text-sm text-gray-500'>
          <p>Need help finding the perfect fragrance?</p>
          <Link
            href='/'
            className='text-primary-600 hover:text-primary-700 font-medium'
          >
            Try our AI fragrance matcher
          </Link>
        </div>
      </div>
    </div>
  );
}
