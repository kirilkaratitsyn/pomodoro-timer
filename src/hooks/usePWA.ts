import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

export function usePWA() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');

      const handleInstalled = () => {
        console.log('Service Worker installed');
      };

      const handleWaiting = () => {
        setIsUpdateAvailable(true);
      };

      const handleControlling = () => {
        window.location.reload();
      };

      wb.addEventListener('installed', handleInstalled);
      wb.addEventListener('waiting', handleWaiting);
      wb.addEventListener('controlling', handleControlling);

      wb.register().then(r => {
        setRegistration(r);
      });

      return () => {
        wb.removeEventListener('installed', handleInstalled);
        wb.removeEventListener('waiting', handleWaiting);
        wb.removeEventListener('controlling', handleControlling);
      };
    }
  }, []);

  const updateServiceWorker = async () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return { isUpdateAvailable, updateServiceWorker };
}