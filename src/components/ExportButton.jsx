
import React from 'react';
import { Button } from "@/components/ui/button";
import localforage from 'localforage';
import Papa from 'papaparse';
import JSZip from 'jszip';

const ExportButton = () => {
  const handleExport = async () => {
    const zip = new JSZip();
    const students = await localforage.getItem('students');
    const classDetails = await localforage.getItem('classDetails');

    if (students) {
      let csvContent = '';
      if (classDetails) {
        const header = `Class: ${classDetails.className}, Week: ${classDetails.classWeek}, Day: ${classDetails.classDay}\n`;
        csvContent += header;
      }

      const csvData = students.map(student => ({
        'Student Name': student.name,
        'Student ID': student.id,
        'Time In': student.timeIn,
        'Time Out': student.timeOut,
      }));

      const csv = Papa.unparse(csvData);
      csvContent += csv;
      zip.file('sign_in_sheet.csv', csvContent);

      const signaturesFolder = zip.folder('signatures');
      students.forEach(student => {
        if (student.signatureIn) {
          const imgData = student.signatureIn.split(',')[1];
          signaturesFolder.file(`${student.id}_signin.png`, imgData, { base64: true });
        }
        if (student.signatureOut) {
          const imgData = student.signatureOut.split(',')[1];
          signaturesFolder.file(`${student.id}_signout.png`, imgData, { base64: true });
        }
      });
    }

    if (classDetails) {
      zip.file('class_details.txt', JSON.stringify(classDetails, null, 2));
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
      const link = document.createElement('a');
      const url = URL.createObjectURL(content);
      link.href = url;
      // Strip characters that are unsafe in filenames before interpolating
      // the user-controlled class details into the download name.
      const safe = (value) => String(value ?? '').replace(/[^a-z0-9_-]+/gi, '_');
      const fileName = classDetails
        ? `${safe(classDetails.className)}_Week${safe(classDetails.classWeek)}_Day${safe(classDetails.classDay)}.zip`
        : 'lab_check_export.zip';
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Button onClick={handleExport}>
      Export Data
    </Button>
  );
};

export default ExportButton;
