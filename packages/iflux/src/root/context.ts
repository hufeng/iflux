import React from 'react';
import { RootStore } from './store';

/**
 * create root context
 *
 * rootContext automatically collect all provider's store
 * when provider's store set namespace
 */
export const RootContext = React.createContext({} as RootStore);
