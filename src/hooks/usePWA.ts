import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePWA() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateServiceWorker] = useState(() => registerSW({
    onNeedRefresh() {
      setNeedRefresh(true);
    },
    onOfflineReady() {
      setOfflineReady(true);
    },
  }));

  const updateApp = async () => {
    if (needRefresh) {
      await updateServiceWorker(true);
      window.location.reload();
    }
  };

  const closePrompt = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return {
    needRefresh,
    offlineReady,
    updateApp,
    closePrompt,
  };
}