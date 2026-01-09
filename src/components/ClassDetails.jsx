import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localforage from 'localforage';

const ClassDetails = () => {
  const [className, setClassName] = useState('');
  const [classWeek, setClassWeek] = useState('');
  const [classDay, setClassDay] = useState('');

  useEffect(() => {
    localforage.getItem('classDetails').then(details => {
      if (details) {
        setClassName(details.className || '');
        setClassWeek(details.classWeek || '');
        setClassDay(details.classDay || '');
      }
    });
  }, []);

  const handleChange = (setter, key) => event => {
    const { value } = event.target;
    setter(value);
    localforage.getItem('classDetails').then(details => {
      const newDetails = { ...details, [key]: value };
      localforage.setItem('classDetails', newDetails);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label htmlFor="className">Class Name</Label>
        <Input
          id="className"
          placeholder="Enter class name"
          value={className}
          onChange={handleChange(setClassName, 'className')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="classWeek">Week</Label>
        <Input
          id="classWeek"
          placeholder="Enter week number"
          value={classWeek}
          onChange={handleChange(setClassWeek, 'classWeek')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="classDay">Day</Label>
        <Input
          id="classDay"
          placeholder="Enter day"
          value={classDay}
          onChange={handleChange(setClassDay, 'classDay')}
        />
      </div>
    </div>
  );
};

export default ClassDetails;
