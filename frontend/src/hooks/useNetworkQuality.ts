'use client';
import { useMemo } from 'react';
import { getNetworkQuality } from '../offline/network';

export const useNetworkQuality = () => useMemo(() => getNetworkQuality(), []);
