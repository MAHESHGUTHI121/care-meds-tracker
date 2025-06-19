
import { useState, useEffect } from 'react';
import { Medication, MedicationLog } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Mock data
const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    timeSlots: ['08:00'],
    startDate: '2024-01-01',
    patientId: '1',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    timeSlots: ['08:00', '20:00'],
    startDate: '2024-01-01',
    patientId: '1',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockLogs: MedicationLog[] = [
  {
    id: '1',
    medicationId: '1',
    patientId: '1',
    takenAt: new Date().toISOString(),
    status: 'taken'
  }
];

export const useMedications = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    const savedMeds = localStorage.getItem('medications');
    const savedLogs = localStorage.getItem('medication_logs');
    
    if (savedMeds) {
      setMedications(JSON.parse(savedMeds));
    } else {
      setMedications(mockMedications);
      localStorage.setItem('medications', JSON.stringify(mockMedications));
    }
    
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    } else {
      setLogs(mockLogs);
      localStorage.setItem('medication_logs', JSON.stringify(mockLogs));
    }
    
    setLoading(false);
  }, []);

  const addMedication = async (medication: Omit<Medication, 'id' | 'createdAt'>) => {
    try {
      const newMedication: Medication = {
        ...medication,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      const updated = [...medications, newMedication];
      setMedications(updated);
      localStorage.setItem('medications', JSON.stringify(updated));
      
      toast({
        title: 'Success',
        description: 'Medication added successfully',
      });
      
      return newMedication;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add medication',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    try {
      const updated = medications.map(med => 
        med.id === id ? { ...med, ...updates } : med
      );
      setMedications(updated);
      localStorage.setItem('medications', JSON.stringify(updated));
      
      toast({
        title: 'Success',
        description: 'Medication updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update medication',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      const updated = medications.filter(med => med.id !== id);
      setMedications(updated);
      localStorage.setItem('medications', JSON.stringify(updated));
      
      toast({
        title: 'Success',
        description: 'Medication deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete medication',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logMedication = async (medicationId: string, status: 'taken' | 'missed' | 'skipped', notes?: string) => {
    try {
      const newLog: MedicationLog = {
        id: Date.now().toString(),
        medicationId,
        patientId: user?.id || '1',
        takenAt: new Date().toISOString(),
        status,
        notes
      };
      
      const updated = [...logs, newLog];
      setLogs(updated);
      localStorage.setItem('medication_logs', JSON.stringify(updated));
      
      toast({
        title: 'Success',
        description: `Medication marked as ${status}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log medication',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getAdherenceRate = (medicationId?: string) => {
    const relevantLogs = medicationId 
      ? logs.filter(log => log.medicationId === medicationId)
      : logs;
    
    if (relevantLogs.length === 0) return 0;
    
    const taken = relevantLogs.filter(log => log.status === 'taken').length;
    return Math.round((taken / relevantLogs.length) * 100);
  };

  return {
    medications,
    logs,
    loading,
    addMedication,
    updateMedication,
    deleteMedication,
    logMedication,
    getAdherenceRate
  };
};
