
import React, { useState, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import SignaturePad from 'react-signature-pad-wrapper';
import localforage from 'localforage';

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

const SignInModal = ({ open, handleClose, handleSignIn, prefilledStudent }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const sigCanvas = useRef({});

  // Update form when prefilledStudent changes
  React.useEffect(() => {
    if (prefilledStudent) {
      setName(prefilledStudent.name);
      setStudentId(prefilledStudent.id);
    } else {
      setName('');
      setStudentId('');
    }
    setError('');
  }, [prefilledStudent, open]);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const saveSignature = async () => {
    const students = await localforage.getItem('students') || [];
    const studentExists = students.some(student => student.id === studentId);

    if (studentExists) {
      setError('A student with this ID has already signed in.');
    } else if (!name || !studentId) {
      setError('Please enter both name and student ID.');
    } else {
      console.log('Signing in student:', { name, id: studentId });
      handleSignIn({
        name,
        id: studentId,
        timeIn: new Date().toLocaleString(),
        signatureIn: sigCanvas.current.toDataURL(),
      });
      setName('');
      setStudentId('');
      setError('');
      clearSignature();
      handleClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Sign In
        </Typography>
        <TextField
          label="Student Name"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          disabled={!!prefilledStudent}
        />
        <TextField
          label="Student ID"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          fullWidth
          sx={{ mt: 2, mb: 2 }}
          disabled={!!prefilledStudent}
        />
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ border: '1px solid black' }}>
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
            Sign In
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SignInModal;
