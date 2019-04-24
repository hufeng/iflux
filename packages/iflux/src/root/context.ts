import React from 'react';
import { RootStore } from './store';

/**
 * create root context
 * rootContext Automatically collect all provider's store
 */
export const RootContext = React.createContext({} as RootStore);
