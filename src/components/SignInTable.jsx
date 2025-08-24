
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Modal,
  Typography,
} from '@mui/material';
import localforage from 'localforage';
import SignInModal from './SignInModal';
import SignOutModal from './SignOutModal';

const SignInTable = () => {
  const [students, setStudents] = useState([]);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSignOutConfirmationModalOpen, setIsSignOutConfirmationModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    localforage.getItem('students').then(data => {
      if (data) {
        setStudents(data);
      }
    });
  }, []);

  const handleOpenSignInModal = () => {
    setIsSignInModalOpen(true);
  };

  const handleCloseSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  const handleOpenSignOutConfirmationModal = student => {
    setCurrentStudent(student);
    setIsSignOutConfirmationModalOpen(true);
  };

  const handleCloseSignOutConfirmationModal = () => {
    setCurrentStudent(null);
    setIsSignOutConfirmationModalOpen(false);
  };

  const handleConfirmSignOut = () => {
    setIsSignOutConfirmationModalOpen(false);
    setIsSignOutModalOpen(true);
  };

  const handleOpenSignOutModal = student => {
    setCurrentStudent(student);
    setIsSignOutModalOpen(true);
  };

  const handleCloseSignOutModal = () => {
    setCurrentStudent(null);
    setIsSignOutModalOpen(false);
  };

  const handleSignIn = studentData => {
    console.log('Adding new student:', studentData);
    const newStudents = [...students, studentData];
    setStudents(newStudents);
    localforage.setItem('students', newStudents);
  };

  const handleSignOut = studentData => {
    const newStudents = students.map(s =>
      s.id === studentData.id ? studentData : s
    );
    setStudents(newStudents);
    localforage.setItem('students', newStudents);
  };

  return (
    <Box>
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleOpenSignInModal}>
        Sign In
      </Button>
      <SignInModal
        open={isSignInModalOpen}
        handleClose={handleCloseSignInModal}
        handleSignIn={handleSignIn}
      />
      {currentStudent && (
        <SignOutModal
          open={isSignOutModalOpen}
          handleClose={handleCloseSignOutModal}
          handleSignOut={handleSignOut}
          student={currentStudent}
        />
      )}
      <Modal
        open={isSignOutConfirmationModalOpen}
        onClose={handleCloseSignOutConfirmationModal}
        aria-labelledby="sign-out-confirmation-modal-title"
        aria-describedby="sign-out-confirmation-modal-description"
      >
        <Box sx={style}>
          <Typography id="sign-out-confirmation-modal-title" variant="h6" component="h2">
            Confirm Sign Out
          </Typography>
          <Typography id="sign-out-confirmation-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to sign out {currentStudent && currentStudent.name}?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button onClick={handleCloseSignOutConfirmationModal} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSignOut} variant="contained" color="secondary">
              Sign Out
            </Button>
          </Box>
        </Box>
      </Modal>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Time In</TableCell>
              <TableCell>Signature In</TableCell>
              <TableCell>Time Out</TableCell>
              <TableCell>Signature Out</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.timeIn}</TableCell>
                <TableCell>
                  {student.signatureIn && (
                    <img src={student.signatureIn} alt="signature" width="100" />
                  )}
                </TableCell>
                <TableCell>{student.timeOut}</TableCell>
                <TableCell>
                  {student.signatureOut && (
                    <img src={student.signatureOut} alt="signature" width="100" />
                  )}
                </TableCell>
                <TableCell>
                  {!student.timeOut && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenSignOutConfirmationModal(student)}
                    >
                      Sign Out
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

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

export default SignInTable;
