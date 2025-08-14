import { ReactNode } from 'react';

export type PageContainerProps = {
  hasNoPaddingX?: boolean;

  /** bg is grey on all screen sizes? */
  bgGrey?: boolean;

  /** bg is grey only on large screen sizes? */
  bgGreyLg?: boolean;

  /** All page content */
  children: ReactNode;
};
