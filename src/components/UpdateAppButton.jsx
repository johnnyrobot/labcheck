import React from 'react';
import { Button } from './ui/button';

const UpdateAppButton = ({ onClick, isUpdateAvailable }) => {
  return (
    <Button onClick={onClick} variant="outline" disabled={!isUpdateAvailable}>
      {isUpdateAvailable ? 'Update Available' : 'Check for Updates'}
    </Button>
  );
};

export default UpdateAppButton;
