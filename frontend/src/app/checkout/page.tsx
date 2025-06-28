'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CheckoutItem } from '@/types/fragrance';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load cart items from localStorage
    const savedItems = localStorage.getItem('cartItems');
    if (savedItems) {
      setCartItems(JSON.parse(savedItems));
    } else {
      // Redirect to home if no items
      router.push('/');
    }
  }, [router]);

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: quantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    setIsLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setOrderComplete(true);
      setIsLoading(false);
      localStorage.removeItem('cartItems');
      toast.success('Order placed successfully!');
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className='min-h-screen bg-gray-50 py-16'>
        <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='card text-center'>
            <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-6' />
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Order Complete!
            </h1>
            <p className='text-gray-600 mb-8'>
              Thank you for your purchase! Your fragrances will be shipped
              within 2-3 business days.
            </p>
            <div className='space-y-4'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Order Summary
                </h3>
                <p className='text-gray-600'>
                  Order Total: ${total.toFixed(2)}
                </p>
                <p className='text-gray-600'>Items: {cartItems.length}</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className='btn-primary w-full'
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='flex items-center mb-8'>
          <button
            onClick={() => router.back()}
            className='btn-secondary mr-4 flex items-center'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </button>
          <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Cart Items */}
          <div className='space-y-6'>
            <div className='card'>
              <div className='flex items-center mb-6'>
                <ShoppingBag className='w-6 h-6 text-primary-600 mr-2' />
                <h2 className='text-xl font-semibold text-gray-900'>
                  Your Items
                </h2>
              </div>

              {cartItems.length === 0 ? (
                <div className='text-center py-8'>
                  <p className='text-gray-500'>Your cart is empty</p>
                  <button
                    onClick={() => router.push('/')}
                    className='btn-primary mt-4'
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className='space-y-4'>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center space-x-4 p-4 border border-gray-200 rounded-lg'
                    >
                      <div className='w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center'>
                        <span className='text-2xl'>🧴</span>
                      </div>

                      <div className='flex-1'>
                        <h3 className='font-semibold text-gray-900'>
                          {item.name}
                        </h3>
                        <p className='text-gray-600'>{item.brand}</p>
                        <p className='text-sm text-gray-500'>{item.size}</p>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <label
                          htmlFor={`quantity-${item.id}`}
                          className='sr-only'
                        >
                          Quantity for {item.name}
                        </label>
                        <select
                          id={`quantity-${item.id}`}
                          value={item.quantity || 1}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                          className='border border-gray-300 rounded px-2 py-1 text-sm'
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='text-right'>
                        <p className='font-semibold text-gray-900'>
                          ${item.price}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className='text-red-600 hover:text-red-700 text-sm flex items-center mt-1'
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className='w-3 h-3 mr-1' />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Info */}
            <div className='card'>
              <div className='flex items-center mb-4'>
                <Truck className='w-6 h-6 text-primary-600 mr-2' />
                <h3 className='text-lg font-semibold text-gray-900'>
                  Shipping Information
                </h3>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='firstName'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    First Name
                  </label>
                  <input
                    type='text'
                    id='firstName'
                    className='input-field'
                    placeholder='John'
                  />
                </div>
                <div>
                  <label
                    htmlFor='lastName'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Last Name
                  </label>
                  <input
                    type='text'
                    id='lastName'
                    className='input-field'
                    placeholder='Doe'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label
                    htmlFor='address'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Address
                  </label>
                  <input
                    type='text'
                    id='address'
                    className='input-field'
                    placeholder='123 Main St'
                  />
                </div>
                <div>
                  <label
                    htmlFor='city'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    City
                  </label>
                  <input
                    type='text'
                    id='city'
                    className='input-field'
                    placeholder='New York'
                  />
                </div>
                <div>
                  <label
                    htmlFor='zipCode'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    ZIP Code
                  </label>
                  <input
                    type='text'
                    id='zipCode'
                    className='input-field'
                    placeholder='10001'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className='space-y-6'>
            {/* Order Summary */}
            <div className='card'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Order Summary
              </h3>

              <div className='space-y-2'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className='border-t pt-2 mt-2'>
                  <div className='flex justify-between text-lg font-semibold text-gray-900'>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {subtotal < 100 && (
                <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
                  <p className='text-sm text-blue-800'>
                    💡 Spend ${(100 - subtotal).toFixed(2)} more for free
                    shipping!
                  </p>
                </div>
              )}
            </div>

            {/* Payment */}
            <div className='card'>
              <div className='flex items-center mb-4'>
                <CreditCard className='w-6 h-6 text-primary-600 mr-2' />
                <h3 className='text-lg font-semibold text-gray-900'>
                  Payment Information
                </h3>
              </div>

              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='cardNumber'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Card Number
                  </label>
                  <input
                    type='text'
                    id='cardNumber'
                    className='input-field'
                    placeholder='1234 5678 9012 3456'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='expiry'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Expiry Date
                    </label>
                    <input
                      type='text'
                      id='expiry'
                      className='input-field'
                      placeholder='MM/YY'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='cvv'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      CVV
                    </label>
                    <input
                      type='text'
                      id='cvv'
                      className='input-field'
                      placeholder='123'
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='cardName'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Name on Card
                  </label>
                  <input
                    type='text'
                    id='cardName'
                    className='input-field'
                    placeholder='John Doe'
                  />
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading || cartItems.length === 0}
                className='w-full mt-6 btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                    Processing Payment...
                  </>
                ) : (
                  `Complete Order - $${total.toFixed(2)}`
                )}
              </button>

              <p className='text-xs text-gray-500 mt-2 text-center'>
                This is a demo checkout. No real payment will be processed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
