import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

const UpdateAppModal = ({ isOpen, onOpenChange, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Update App</DialogTitle>
        </DialogHeader>
        <p>A new version of the app is available. Do you want to update now?</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirm}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAppModal;
