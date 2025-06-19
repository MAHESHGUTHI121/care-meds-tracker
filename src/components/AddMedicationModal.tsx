
import React, { useState } from 'react';
import { useMedications } from '../hooks/useMedications';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface AddMedicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { addMedication } = useMedications();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    timeSlots: [''],
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 2 hours',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'As needed'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage || !formData.frequency) return;

    setLoading(true);
    try {
      await addMedication({
        ...formData,
        patientId: user?.id || '1',
        timeSlots: formData.timeSlots.filter(slot => slot.trim() !== '')
      });
      
      // Reset form
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        timeSlots: [''],
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
      
      onOpenChange(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      timeSlots: [...formData.timeSlots, '']
    });
  };

  const removeTimeSlot = (index: number) => {
    const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index);
    setFormData({ ...formData, timeSlots: newTimeSlots });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimeSlots = [...formData.timeSlots];
    newTimeSlots[index] = value;
    setFormData({ ...formData, timeSlots: newTimeSlots });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
          <DialogDescription>
            Add a new medication to your schedule with timing and dosage information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Medication Name</Label>
              <Input
                id="name"
                placeholder="e.g., Lisinopril"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                placeholder="e.g., 10mg"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time Slots</Label>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {formData.timeSlots.map((timeSlot, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={timeSlot}
                        onChange={(e) => updateTimeSlot(index, e.target.value)}
                        className="flex-1"
                      />
                      {formData.timeSlots.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTimeSlot}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Medication'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationModal;
