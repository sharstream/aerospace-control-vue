/**
 * Class name utility for merging Tailwind classes
 * Uses clsx for conditional class names and tailwind-merge to resolve conflicts
 *
 * @param {...import('clsx').ClassValue} inputs - Class names to merge
 * @returns {string} Merged class name string
 *
 * @example
 * cn('tw-px-4 tw-py-2', isActive && 'tw-bg-blue-500', 'tw-px-6')
 * // => 'tw-px-6 tw-py-2 tw-bg-blue-500'
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
