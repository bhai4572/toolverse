'use client';

import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}

export function AdSlot({ slotId = 'default-slot', format = 'auto', className = '' }: AdSlotProps) {
  const enableAds = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';

  if (!enableAds || process.env.NODE_ENV === 'development') {
    return null;
  }

  return (
    <div className={`my-8 p-4 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-center ${className}`}>
      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block mb-2">
        Advertisement
      </span>
      <div className="min-h-[90px] flex items-center justify-center text-xs text-slate-400">
        {/* AdSense Unit Placeholder */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
