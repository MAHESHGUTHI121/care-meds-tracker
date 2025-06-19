
import React from 'react';
import { useMedications } from '../hooks/useMedications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MedicationList: React.FC = () => {
  const { medications, loading, logMedication, deleteMedication, getAdherenceRate } = useMedications();

  const handleMarkTaken = async (medicationId: string) => {
    try {
      await logMedication(medicationId, 'taken');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleMarkMissed = async (medicationId: string) => {
    try {
      await logMedication(medicationId, 'missed');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async (medicationId: string, medicationName: string) => {
    if (window.confirm(`Are you sure you want to delete ${medicationName}?`)) {
      try {
        await deleteMedication(medicationId);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (medications.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No medications added</h3>
        <p className="text-gray-500 mb-4">Get started by adding your first medication</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medications.map(medication => {
        const adherenceRate = getAdherenceRate(medication.id);
        
        return (
          <Card key={medication.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{medication.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-4 text-sm">
                    <span>{medication.dosage}</span>
                    <span>{medication.frequency}</span>
                    <Badge variant="outline">{medication.timeSlots.join(', ')}</Badge>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(medication.id, medication.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Adherence Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Adherence Rate</span>
                    <span className="text-sm text-gray-600">{adherenceRate}%</span>
                  </div>
                  <Progress value={adherenceRate} className="h-2" />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => handleMarkTaken(medication.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Taken
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleMarkMissed(medication.id)}
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mark as Missed
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MedicationList;
