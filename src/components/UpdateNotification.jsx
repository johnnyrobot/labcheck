import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket } from "lucide-react";

const UpdateNotification = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          setWaitingWorker(registration.waiting);
          setIsUpdateAvailable(true);
        }
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setIsUpdateAvailable(true);
            }
          });
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      waitingWorker.addEventListener('statechange', () => {
        if (waitingWorker.state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Alert>
        <Rocket className="h-4 w-4" />
        <AlertTitle>Update Available!</AlertTitle>
        <AlertDescription>
          A new version of the app is ready. Click to update.
          <Button onClick={handleUpdate} size="sm" className="ml-4">
            Update
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default UpdateNotification;
