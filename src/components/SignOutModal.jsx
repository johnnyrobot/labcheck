
import React, { useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
} from '@mui/material';
import SignaturePad from 'react-signature-pad-wrapper';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const SignOutModal = ({ open, handleClose, handleSignOut, student }) => {
  const sigCanvas = useRef({});

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const saveSignature = () => {
    handleSignOut({
      ...student,
      timeOut: new Date().toLocaleString(),
      signatureOut: sigCanvas.current.toDataURL(),
    });
    clearSignature();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Sign Out
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Signing out: {student && student.name}
        </Typography>
        <Box sx={{ border: '1px solid black', mt: 2 }}>
          <SignaturePad
            ref={sigCanvas}
            options={{ penColor: 'black' }}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button onClick={clearSignature} sx={{ mr: 1 }}>
            Clear
          </Button>
          <Button onClick={saveSignature} variant="contained">
            Sign Out
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SignOutModal;
