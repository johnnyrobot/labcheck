import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SignaturePad from 'react-signature-pad-wrapper';
import localforage from 'localforage';

const SignInModal = ({ open, handleClose, handleSignIn, prefilledStudent }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const sigCanvas = useRef(null);

  useEffect(() => {
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
    sigCanvas.current?.clear();
  };

  const saveSignature = async () => {
    const students = (await localforage.getItem('students')) || [];
    const studentExists = students.some((student) => student.id === studentId);

    if (studentExists) {
      setError('A student with this ID has already signed in.');
    } else if (!name || !studentId) {
      setError('Please enter both name and student ID.');
    } else {
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
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-name">Student Name</Label>
            <Input
              id="signin-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!!prefilledStudent}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-id">Student ID</Label>
            <Input
              id="signin-id"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={!!prefilledStudent}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="rounded-md border border-input">
            <SignaturePad ref={sigCanvas} options={{ penColor: 'black' }} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={clearSignature}>
            Clear
          </Button>
          <Button onClick={saveSignature}>Sign In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
