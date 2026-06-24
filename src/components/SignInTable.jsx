import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
    localforage.getItem('students').then((data) => {
      if (data) setStudents(data);
    });
  }, []);

  const handleOpenSignInModal = () => setIsSignInModalOpen(true);
  const handleCloseSignInModal = () => setIsSignInModalOpen(false);

  const handleOpenSignOutConfirmationModal = (student) => {
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
  const handleCloseSignOutModal = () => {
    setCurrentStudent(null);
    setIsSignOutModalOpen(false);
  };

  const handleSignIn = (studentData) => {
    const newStudents = [...students, studentData];
    setStudents(newStudents);
    localforage.setItem('students', newStudents);
  };

  const handleSignOut = (studentData) => {
    const newStudents = students.map((s) =>
      s.id === studentData.id ? studentData : s
    );
    setStudents(newStudents);
    localforage.setItem('students', newStudents);
  };

  return (
    <div>
      <Button className="mb-4" onClick={handleOpenSignInModal}>
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

      <Dialog
        open={isSignOutConfirmationModalOpen}
        onOpenChange={(o) => !o && handleCloseSignOutConfirmationModal()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out {currentStudent && currentStudent.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseSignOutConfirmationModal}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSignOut}>Sign Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Signature In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Signature Out</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
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
                      variant="secondary"
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
      </div>
    </div>
  );
};

export default SignInTable;
