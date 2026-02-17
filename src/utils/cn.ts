import clsx from 'clsx';

import { twMerge } from 'tailwind-merge';

/**
 * Merges class names using clsx and resolves Tailwind CSS conflicts.
 * @param args - Class names, objects, or arrays to merge
 * @returns Merged and conflict-resolved class string
 */

const cn = (...args: Parameters<typeof clsx>): string => twMerge(clsx(...args));

export default cn;
