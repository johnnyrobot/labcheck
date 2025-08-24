import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Papa from 'papaparse';
import localforage from 'localforage';

const RosterUpload = ({ open, handleClose, onRosterUploaded }) => {
  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV: ' + results.errors[0].message);
          return;
        }

        // Validate CSV structure
        const requiredColumns = ['name', 'id'];
        const headers = Object.keys(results.data[0] || {}).map(h => h.toLowerCase().trim());
        
        const hasRequiredColumns = requiredColumns.every(col => 
          headers.some(header => header.includes(col) || header.includes('student'))
        );

        if (!hasRequiredColumns) {
          setError('CSV must contain columns for student name and student ID. Expected columns like "name", "student name", "id", "student id"');
          return;
        }

        // Process and normalize the data
        const processedData = results.data.map((row, index) => {
          const normalizedRow = {};
          Object.keys(row).forEach(key => {
            const normalizedKey = key.toLowerCase().trim();
            if (normalizedKey.includes('name')) {
              normalizedRow.name = row[key].trim();
            } else if (normalizedKey.includes('id')) {
              normalizedRow.id = row[key].trim();
            }
          });

          if (!normalizedRow.name || !normalizedRow.id) {
            throw new Error(`Row ${index + 1} is missing name or ID`);
          }

          return normalizedRow;
        }).filter(row => row.name && row.id);

        if (processedData.length === 0) {
          setError('No valid student records found in CSV');
          return;
        }

        setCsvData(processedData);
        setIsPreview(true);
        setError('');
      },
      error: (error) => {
        setError('Error reading file: ' + error.message);
      }
    });
  };

  const handleConfirmUpload = async () => {
    try {
      // Save roster to localforage
      await localforage.setItem('studentRoster', csvData);
      
      setSuccess(`Successfully uploaded ${csvData.length} students to roster`);
      setIsPreview(false);
      setCsvData([]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent component
      if (onRosterUploaded) {
        onRosterUploaded(csvData);
      }

      // Close modal after a short delay
      setTimeout(() => {
        setSuccess('');
        handleClose();
      }, 2000);
    } catch (error) {
      setError('Error saving roster: ' + error.message);
    }
  };

  const handleCancel = () => {
    setIsPreview(false);
    setCsvData([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleModalClose = () => {
    handleCancel();
    setSuccess('');
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Student Roster
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file with student names and IDs. The CSV should have columns for student name and student ID.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isPreview && (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <Button variant="outline" asChild>
                    <span>Choose CSV File</span>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Click to select a CSV file from your computer
                  </p>
                </div>
              </label>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {isPreview && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Preview</h3>
                <p className="text-sm text-muted-foreground">
                  {csvData.length} students found
                </p>
              </div>
              
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Student ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {isPreview ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleConfirmUpload}>
                Confirm Upload
              </Button>
            </div>
          ) : (
            !success && (
              <Button variant="outline" onClick={handleModalClose}>
                Close
              </Button>
            )
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RosterUpload;
