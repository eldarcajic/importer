'use client';

import { ReactNode } from 'react';
import { CsvDataProvider } from './CsvDataContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../queryClient';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CsvDataProvider>{children}</CsvDataProvider>
    </QueryClientProvider>
  );
};
