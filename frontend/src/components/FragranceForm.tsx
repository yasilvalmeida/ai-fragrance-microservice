'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Sparkles, ArrowRight, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  FragranceRequest,
  FragranceIntensity,
  FragranceOccasion,
  FragranceSeason,
} from '@/types/fragrance';

interface FragranceFormProps {
  onSubmit: (data: FragranceRequest) => Promise<void>;
  isLoading?: boolean;
}

export default function FragranceForm({
  onSubmit,
  isLoading,
}: FragranceFormProps) {
  const [customNote, setCustomNote] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FragranceRequest>({
    defaultValues: {
      preferences: '',
      preferredNotes: [],
      intensity: FragranceIntensity.MODERATE,
      occasion: FragranceOccasion.DAILY,
      season: FragranceSeason.ALL_YEAR,
      budget: '',
      gender: '',
    },
  });

  const watchedNotes = watch('preferredNotes') || [];

  const popularNotes = [
    'bergamot',
    'vanilla',
    'sandalwood',
    'rose',
    'jasmine',
    'citrus',
    'lavender',
    'patchouli',
    'amber',
    'musk',
    'cedar',
    'lemon',
    'orange',
    'ylang-ylang',
    'neroli',
    'oud',
    'tobacco',
    'coffee',
  ];

  const addNote = (note: string) => {
    if (!watchedNotes.includes(note) && watchedNotes.length < 10) {
      setValue('preferredNotes', [...watchedNotes, note]);
    }
  };

  const removeNote = (note: string) => {
    setValue(
      'preferredNotes',
      watchedNotes.filter((n) => n !== note)
    );
  };

  const addCustomNote = () => {
    if (
      customNote.trim() &&
      !watchedNotes.includes(customNote.trim()) &&
      watchedNotes.length < 10
    ) {
      addNote(customNote.trim());
      setCustomNote('');
    }
  };

  const handleFormSubmit = async (data: FragranceRequest) => {
    if (data.preferredNotes.length === 0) {
      toast.error('Please select at least one preferred note');
      return;
    }

    try {
      await onSubmit(data);
    } catch (error) {
      toast.error('Failed to get recommendations. Please try again.');
    }
  };

  return (
    <div className='card max-w-4xl mx-auto'>
      <div className='text-center mb-8'>
        <div className='flex items-center justify-center mb-4'>
          <Sparkles className='w-8 h-8 text-primary-500 mr-2' />
          <h2 className='text-3xl font-bold text-gray-900'>
            Find Your Perfect Fragrance
          </h2>
        </div>
        <p className='text-gray-600 text-lg'>
          Tell us about your preferences and let AI find fragrances that match
          your personality
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
        {/* Preferences Description */}
        <div>
          <label
            htmlFor='preferences'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Describe your fragrance preferences and personality *
          </label>
          <textarea
            id='preferences'
            {...register('preferences', {
              required: 'Please describe your preferences',
              minLength: {
                value: 10,
                message: 'Please provide at least 10 characters',
              },
              maxLength: {
                value: 500,
                message: 'Description cannot exceed 500 characters',
              },
            })}
            rows={4}
            className='input-field resize-none'
            placeholder='e.g., I love fresh, citrusy scents that make me feel energetic and confident. I prefer lighter fragrances for daily wear...'
          />
          {errors.preferences && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.preferences.message}
            </p>
          )}
          <p className='mt-1 text-sm text-gray-500'>
            {watch('preferences')?.length || 0}/500 characters
          </p>
        </div>

        {/* Preferred Notes */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            Preferred Fragrance Notes * (Select up to 10)
          </label>

          {/* Selected Notes */}
          {watchedNotes.length > 0 && (
            <div className='mb-4'>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                Selected Notes:
              </h4>
              <div className='flex flex-wrap gap-2'>
                {watchedNotes.map((note) => (
                  <span
                    key={note}
                    className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800'
                  >
                    {note}
                    <button
                      type='button'
                      onClick={() => removeNote(note)}
                      className='ml-2 text-primary-600 hover:text-primary-800'
                      aria-label={`Remove ${note}`}
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Popular Notes */}
          <div className='mb-4'>
            <h4 className='text-sm font-medium text-gray-700 mb-2'>
              Popular Notes:
            </h4>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
              {popularNotes.map((note) => (
                <button
                  key={note}
                  type='button'
                  onClick={() => addNote(note)}
                  disabled={
                    watchedNotes.includes(note) || watchedNotes.length >= 10
                  }
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    watchedNotes.includes(note)
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-primary-50 hover:border-primary-300'
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Note Input */}
          <div className='flex gap-2'>
            <input
              type='text'
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder='Add custom note...'
              className='input-field flex-1'
              disabled={watchedNotes.length >= 10}
            />
            <button
              type='button'
              onClick={addCustomNote}
              disabled={
                !customNote.trim() ||
                watchedNotes.includes(customNote.trim()) ||
                watchedNotes.length >= 10
              }
              className='btn-primary flex items-center'
              aria-label='Add custom note'
            >
              <Plus className='w-4 h-4' />
            </button>
          </div>

          {errors.preferredNotes && (
            <p className='mt-1 text-sm text-red-600'>
              Please select at least one note
            </p>
          )}
        </div>

        {/* Form Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Intensity */}
          <div>
            <label
              htmlFor='intensity'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Fragrance Intensity *
            </label>
            <Controller
              name='intensity'
              control={control}
              rules={{ required: 'Please select an intensity' }}
              render={({ field }) => (
                <select {...field} className='input-field'>
                  <option value={FragranceIntensity.LIGHT}>Light</option>
                  <option value={FragranceIntensity.MODERATE}>Moderate</option>
                  <option value={FragranceIntensity.STRONG}>Strong</option>
                </select>
              )}
            />
          </div>

          {/* Occasion */}
          <div>
            <label
              htmlFor='occasion'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Occasion *
            </label>
            <Controller
              name='occasion'
              control={control}
              rules={{ required: 'Please select an occasion' }}
              render={({ field }) => (
                <select {...field} className='input-field'>
                  <option value={FragranceOccasion.DAILY}>Daily Wear</option>
                  <option value={FragranceOccasion.WORK}>
                    Work/Professional
                  </option>
                  <option value={FragranceOccasion.CASUAL}>Casual</option>
                  <option value={FragranceOccasion.EVENING}>Evening</option>
                  <option value={FragranceOccasion.SPECIAL}>
                    Special Occasions
                  </option>
                </select>
              )}
            />
          </div>

          {/* Season */}
          <div>
            <label
              htmlFor='season'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Preferred Season *
            </label>
            <Controller
              name='season'
              control={control}
              rules={{ required: 'Please select a season' }}
              render={({ field }) => (
                <select {...field} className='input-field'>
                  <option value={FragranceSeason.ALL_YEAR}>All Year</option>
                  <option value={FragranceSeason.SPRING}>Spring</option>
                  <option value={FragranceSeason.SUMMER}>Summer</option>
                  <option value={FragranceSeason.FALL}>Fall</option>
                  <option value={FragranceSeason.WINTER}>Winter</option>
                </select>
              )}
            />
          </div>

          {/* Budget */}
          <div>
            <label
              htmlFor='budget'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Budget Range (Optional)
            </label>
            <input
              {...register('budget')}
              type='text'
              placeholder='e.g., $50-150'
              className='input-field'
            />
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor='gender'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Gender Preference (Optional)
            </label>
            <select {...register('gender')} className='input-field'>
              <option value=''>No preference</option>
              <option value='masculine'>Masculine</option>
              <option value='feminine'>Feminine</option>
              <option value='unisex'>Unisex</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className='text-center pt-6'>
          <button
            type='submit'
            disabled={isLoading}
            className='btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                <span>Finding Your Perfect Match...</span>
              </>
            ) : (
              <>
                <span>Get My Recommendations</span>
                <ArrowRight className='w-5 h-5' />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
