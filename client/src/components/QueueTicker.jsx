import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export const QueueTicker = () => {
  const [queueData, setQueueData] = useState({
    callingToken: '#TK-101 (Counter 2)',
    waitingCount: 3,
    estWaitTime: '~6-8 Mins'
  });

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await api.getLiveQueue();
        if (res.success && res.data) {
          setQueueData(res.data);
        }
      } catch {
        // Fallback gracefully
      }
    };
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="live-queue-strip" id="live-queue-strip">
      <div className="queue-strip-content">
        <div className="queue-strip-item queue-calling">
          <span className="live-pulse-dot"></span>
          <span className="queue-label">NOW CALLING AT COUNTER:</span>
          <strong className="queue-tokens-serving">{queueData.callingToken}</strong>
        </div>

        <div className="queue-strip-divider">|</div>

        <div className="queue-strip-item">
          <span>🍳</span>
          <span className="queue-label">KITCHEN QUEUE:</span>
          <strong style={{ color: '#fed7aa' }}>{queueData.waitingCount} Orders in line</strong>
        </div>

        <div className="queue-strip-divider">|</div>

        <div className="queue-strip-item">
          <span>⏱️</span>
          <span className="queue-label">EST. WAIT TIME:</span>
          <strong style={{ color: '#38bdf8' }}>{queueData.estWaitTime}</strong>
        </div>
      </div>
    </section>
  );
};
