
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'caretaker';
  createdAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeSlots: string[];
  startDate: string;
  endDate?: string;
  patientId: string;
  createdAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  patientId: string;
  takenAt: string;
  status: 'taken' | 'missed' | 'skipped';
  notes?: string;
  photoUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'patient' | 'caretaker') => Promise<void>;
  logout: () => void;
  loading: boolean;
}
