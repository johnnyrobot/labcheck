import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Clock, CheckCircle, XCircle, AlertCircle, List, Grid } from "lucide-react";
import localforage from 'localforage';
import SignInModal from './SignInModal';
import SignOutModal from './SignOutModal';

const StudentDashboard = () => {
  const [roster, setRoster] = useState([]);
  const [signedInStudents, setSignedInStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);
  const [viewMode, setViewMode] = useState('card');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const rosterData = await localforage.getItem('studentRoster') || [];
      const studentsData = await localforage.getItem('students') || [];
      
      setRoster(rosterData);
      setSignedInStudents(studentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getStudentStatus = (studentId) => {
    const signedInStudent = signedInStudents.find(s => s.id === studentId);
    if (!signedInStudent) return 'not-signed-in';
    if (signedInStudent.timeOut) return 'signed-out';
    return 'signed-in';
  };

  const getStudentRecord = (studentId) => {
    return signedInStudents.find(s => s.id === studentId);
  };

  const handleStudentClick = (student) => {
    const status = getStudentStatus(student.id);
    setSelectedStudent(student);

    if (status === 'not-signed-in') {
      setIsSignInModalOpen(true);
    } else if (status === 'signed-in') {
      setIsSignOutConfirmOpen(true);
    }
  };

  const handleSignIn = (studentData) => {
    const newStudents = [...signedInStudents, studentData];
    setSignedInStudents(newStudents);
    localforage.setItem('students', newStudents);
    setIsSignInModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSignOut = (studentData) => {
    const newStudents = signedInStudents.map(s =>
      s.id === studentData.id ? studentData : s
    );
    setSignedInStudents(newStudents);
    localforage.setItem('students', newStudents);
    setIsSignOutModalOpen(false);
    setSelectedStudent(null);
  };

  const handleConfirmSignOut = () => {
    setIsSignOutConfirmOpen(false);
    setIsSignOutModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsSignInModalOpen(false);
    setIsSignOutModalOpen(false);
    setIsSignOutConfirmOpen(false);
    setSelectedStudent(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'signed-in': return <CheckCircle className="h-4 w-4" />;
      case 'signed-out': return <XCircle className="h-4 w-4" />;
      case 'not-signed-in': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'signed-in': return 'default';
      case 'signed-out': return 'secondary';
      case 'not-signed-in': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'signed-in': return 'Signed In';
      case 'signed-out': return 'Signed Out';
      case 'not-signed-in': return 'Not Signed In';
      default: return 'Unknown';
    }
  };

  const getButtonText = (status) => {
    switch (status) {
      case 'signed-in': return 'Sign Out';
      case 'signed-out': return 'Already Signed Out';
      case 'not-signed-in': return 'Sign In';
      default: return 'Unknown';
    }
  };

  if (roster.length === 0) {
    return (
      <div className="text-center py-12">
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No student roster found. Please upload a CSV file with student names and IDs first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Student Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            {roster.length} students • Click on a student to sign them in or out
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'card' ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('card')}
          >
            <Grid className="h-4 w-4 mr-2" />
            Card View
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List View
          </Button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roster.map((student) => {
            const status = getStudentStatus(student.id);
            const studentRecord = getStudentRecord(student.id);
            const isDisabled = status === 'signed-out';

            return (
              <Card 
                key={student.id}
                className={`transition-all duration-200 hover:shadow-lg cursor-pointer border-0 bg-gradient-to-br ${
                  status === 'signed-in' 
                    ? 'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100' 
                    : status === 'signed-out'
                    ? 'from-gray-50 to-slate-50 opacity-75'
                    : 'from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100'
                } ${isDisabled ? 'cursor-default' : ''}`}
                onClick={() => !isDisabled && handleStudentClick(student)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${
                        status === 'signed-in' 
                          ? 'bg-green-100 text-green-600' 
                          : status === 'signed-out'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <User className="h-4 w-4" />
                      </div>
                      <Badge variant={getStatusVariant(status)} className="flex items-center gap-1">
                        {getStatusIcon(status)}
                        {getStatusText(status)}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {studentRecord && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>In: {studentRecord.timeIn}</span>
                      </div>
                      {studentRecord.timeOut && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Out: {studentRecord.timeOut}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Button 
                    variant={status === 'not-signed-in' ? 'default' : 'outline'}
                    size="sm"
                    disabled={isDisabled}
                    className={`w-full ${
                      status === 'signed-in' 
                        ? 'border-red-200 text-red-600 hover:bg-red-50' 
                        : status === 'not-signed-in'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                        : ''
                    }`}
                  >
                    {getButtonText(status)}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="divide-y">
            {roster.map((student, index) => {
              const status = getStudentStatus(student.id);
              const studentRecord = getStudentRecord(student.id);
              const isDisabled = status === 'signed-out';

              return (
                <div 
                  key={student.id}
                  className={`flex items-center justify-between p-4 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} ${!isDisabled && 'hover:bg-slate-100 cursor-pointer'}`}
                  onClick={() => !isDisabled && handleStudentClick(student)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      status === 'signed-in' 
                        ? 'bg-green-100 text-green-600' 
                        : status === 'signed-out'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusVariant(status)} className="w-32 justify-center hidden sm:flex items-center gap-1">
                      {getStatusIcon(status)}
                      {getStatusText(status)}
                    </Badge>
                    {studentRecord && (
                      <div className="text-xs text-muted-foreground hidden lg:block">
                        <p>In: {studentRecord.timeIn}</p>
                        {studentRecord.timeOut && <p>Out: {studentRecord.timeOut}</p>}
                      </div>
                    )}
                    <Button 
                      variant={status === 'not-signed-in' ? 'default' : 'outline'}
                      size="sm"
                      disabled={isDisabled}
                      className={`w-28 ${
                        status === 'signed-in' 
                          ? 'border-red-200 text-red-600 hover:bg-red-50' 
                          : status === 'not-signed-in'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                          : ''
                      }`}
                    >
                      {getButtonText(status)}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {selectedStudent && (
        <SignInModal
          open={isSignInModalOpen}
          handleClose={handleCloseModals}
          handleSignIn={handleSignIn}
          prefilledStudent={selectedStudent}
        />
      )}

      {/* Sign Out Confirmation Modal */}
      {selectedStudent && isSignOutConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Confirm Sign Out</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Are you sure you want to sign out {selectedStudent.name}?</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseModals}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleConfirmSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sign Out Modal */}
      {selectedStudent && (
        <SignOutModal
          open={isSignOutModalOpen}
          handleClose={handleCloseModals}
          handleSignOut={handleSignOut}
          student={getStudentRecord(selectedStudent.id)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
