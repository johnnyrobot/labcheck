import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Users, UserPlus } from "lucide-react";
import ClassDetails from './components/ClassDetails';
import SignInTable from './components/SignInTable';
import StudentDashboard from './components/StudentDashboard';
import RosterUpload from './components/RosterUpload';
import ExportButton from './components/ExportButton';
import ClearDataButton from './components/ClearDataButton';
import UpdateAppButton from './components/UpdateAppButton';
import UpdateAppModal from './components/UpdateAppModal';

function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isRosterUploadOpen, setIsRosterUploadOpen] = useState(false);
  const [rosterKey, setRosterKey] = useState(0);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          setWaitingWorker(registration.waiting);
          setIsUpdateAvailable(true);
        }
        if (registration) {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setIsUpdateAvailable(true);
              }
            });
          });
        }
      });
    }
  }, []);

  const handleRosterUploaded = () => {
    setCurrentTab("dashboard");
    setRosterKey(prevKey => prevKey + 1);
  };

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      waitingWorker.addEventListener('statechange', () => {
        if (waitingWorker.state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            LabCheck
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Modern Student Sign-In System
          </p>
          <p className="text-sm text-slate-500">
            Version 8.26.25.0
          </p>
        </div>

        {/* Class Information Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Class Information</CardTitle>
            <CardDescription className="text-blue-100">
              Configure your class details for the sign-in session
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <ClassDetails />
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">Student Management</CardTitle>
                <CardDescription className="text-purple-100">
                  Manage student sign-ins and view attendance
                </CardDescription>
              </div>
              <Button 
                onClick={() => setIsRosterUploadOpen(true)}
                className="bg-white text-purple-600 hover:bg-purple-50 font-semibold shadow-lg"
                size="lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Roster
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold"
                >
                  <Users className="h-4 w-4" />
                  Student Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="manual" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold"
                >
                  <UserPlus className="h-4 w-4" />
                  Manual Sign-In
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="mt-0">
                <StudentDashboard key={rosterKey} />
              </TabsContent>
              
              <TabsContent value="manual" className="mt-0">
                <SignInTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4">
          <ExportButton />
          <ClearDataButton />
          <UpdateAppButton 
            onClick={() => setUpdateModalOpen(true)} 
            isUpdateAvailable={isUpdateAvailable} 
          />
        </div>

        {/* Roster Upload Modal */}
        <RosterUpload 
          open={isRosterUploadOpen}
          handleClose={() => setIsRosterUploadOpen(false)}
          onRosterUploaded={handleRosterUploaded}
        />
        
        <UpdateAppModal 
          isOpen={isUpdateModalOpen}
          onOpenChange={setUpdateModalOpen}
          onConfirm={handleUpdate}
        />
      </div>
    </div>
  );
}

export default App;