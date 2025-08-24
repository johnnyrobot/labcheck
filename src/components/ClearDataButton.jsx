
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RotateCcw, AlertTriangle } from "lucide-react";
import localforage from 'localforage';

const ClearDataButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClearAllData = async () => {
    try {
      // Clear all stored data
      await localforage.removeItem('students');
      await localforage.removeItem('classDetails');
      await localforage.removeItem('studentRoster');
      
      handleClose();
      
      // Reload the page to reset the app state
      window.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <>
      <Button 
        onClick={handleOpen}
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Start New Session
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Start New Session
            </DialogTitle>
            <DialogDescription className="text-left">
              This will clear all data including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Class information (name, week, day)</li>
                <li>Student roster</li>
                <li>All sign-in records</li>
              </ul>
              <p className="mt-3 font-medium">This action cannot be undone.</p>
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="bg-red-500 text-white" onClick={handleClearAllData}>
              Clear All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClearDataButton;
