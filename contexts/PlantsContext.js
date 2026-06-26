import { createContext, useContext } from 'react';
import { usePlants } from '../hooks/usePlants';

const PlantsContext = createContext(null);

export function PlantsProvider({ children }) {
  const value = usePlants();
  return <PlantsContext.Provider value={value}>{children}</PlantsContext.Provider>;
}

export function usePlantsStore() {
  const value = useContext(PlantsContext);
  if (!value) {
    throw new Error('usePlantsStore must be used inside PlantsProvider');
  }
  return value;
}
