import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size='lg' />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-8 h-8');
  });

  it('renders with custom color', () => {
    render(<LoadingSpinner color='secondary' />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('border-secondary-600');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className='custom-class' />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-class');
  });

  it('has screen reader text', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
