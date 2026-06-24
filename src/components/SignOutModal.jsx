import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignaturePad from 'react-signature-pad-wrapper';

const SignOutModal = ({ open, handleClose, handleSignOut, student }) => {
  const sigCanvas = useRef(null);

  const clearSignature = () => {
    sigCanvas.current?.clear();
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
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign Out</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Signing out: {student && student.name}
        </p>
        <div className="rounded-md border border-input">
          <SignaturePad ref={sigCanvas} options={{ penColor: 'black' }} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={clearSignature}>
            Clear
          </Button>
          <Button onClick={saveSignature}>Sign Out</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutModal;
