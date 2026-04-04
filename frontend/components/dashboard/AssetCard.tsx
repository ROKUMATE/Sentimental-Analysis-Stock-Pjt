'use client';

import { Asset } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Check } from 'lucide-react';
import { useState } from 'react';

interface AssetCardProps {
  asset: Asset;
  isTracked: boolean;
  onToggleTracking: (isTracked: boolean) => Promise<void>;
}

export const AssetCard = ({
  asset,
  isTracked,
  onToggleTracking,
}: AssetCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onToggleTracking(isTracked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 border border-neutral-700/60 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors flex flex-col justify-between shadow-sm">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-lg font-bold text-foreground">{asset.symbol}</p>
            <p className="text-sm text-muted-foreground">{asset.name}</p>
          </div>
          <Badge 
            variant="outline"
            className={
              asset.type === 'CRYPTO' 
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }
          >
            {asset.type}
          </Badge>
        </div>
      </div>

      <Button
        onClick={handleClick}
        disabled={isLoading}
        size="sm"
        className={`w-full transition-colors font-medium shadow-sm ${
          isTracked
            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]'
            : 'bg-violet-500 hover:bg-violet-400 text-white border-none shadow-[0_0_15px_rgba(139,92,246,0.15)]'
        }`}
      >
        {isLoading ? (
          'Loading...'
        ) : isTracked ? (
          <>
            <Check className="h-4 w-4 mr-2" /> Tracked
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" /> Track
          </>
        )}
      </Button>
    </Card>
  );
};
