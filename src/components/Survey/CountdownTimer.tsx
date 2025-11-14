'use client';

import { useState, useEffect } from 'react';
import { HiClock } from 'react-icons/hi';

interface CountdownTimerProps {
  target: string;
  onExpire?: () => void;
}

export default function CountdownTimer({ target, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(target).getTime() - Date.now();
      
      if (diff <= 0) {
        setTimeLeft('Expired');
        setIsExpired(true);
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target, onExpire]);

  if (isExpired) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white text-center py-3 px-4 z-50 shadow-lg animate-pulse">
      <div className="flex items-center justify-center gap-3 font-semibold text-lg">
        <HiClock size={24} className="animate-bounce" />
        <span>
          Survey closes in: <span className="font-bold underline decoration-2">{timeLeft}</span>
        </span>
      </div>
    </div>
  );
}
