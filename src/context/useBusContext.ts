import React from 'react';
import { BusContext } from './BusContextType';

export const useBusContext = () => {
  const context = React.useContext(BusContext);
  if (!context) {
    throw new Error('useBusContext must be used within BusProvider');
  }
  return context;
};
