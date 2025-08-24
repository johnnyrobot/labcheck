import React from 'react';
import { Button } from './ui/button';

const UpdateAppButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} variant="outline">
      Update App
    </Button>
  );
};

export default UpdateAppButton;
