
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMedications } from '../hooks/useMedications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, Clock, Plus, TrendingUp, AlertCircle } from 'lucide-react';
import MedicationList from './MedicationList';
import AddMedicationModal from './AddMedicationModal';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { medications, logs, loading, getAdherenceRate } = useMedications();
  const [showAddModal, setShowAddModal] = React.useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const overallAdherence = getAdherenceRate();
  const todaysMedications = medications.length;
  const takenToday = logs.filter(log => {
    const today = new Date().toDateString();
    const logDate = new Date(log.takenAt).toDateString();
    return logDate === today && log.status === 'taken';
  }).length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg text-white p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          {user?.role === 'patient' 
            ? "Let's keep track of your medications today" 
            : "Monitor your patients' medication adherence"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Medications</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{takenToday}/{todaysMedications}</div>
            <p className="text-xs text-muted-foreground">
              medications taken today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adherence Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAdherence}%</div>
            <Progress value={overallAdherence} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medications.length}</div>
            <p className="text-xs text-muted-foreground">
              active prescriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              days consistent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Medications</CardTitle>
              <CardDescription>
                Manage your medication schedule and track adherence
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <MedicationList />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest medication logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.slice(0, 5).map(log => {
              const medication = medications.find(m => m.id === log.medicationId);
              return (
                <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      log.status === 'taken' ? 'bg-green-500' : 
                      log.status === 'missed' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium">{medication?.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(log.takenAt).toLocaleDateString()} at {new Date(log.takenAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={log.status === 'taken' ? 'default' : 'secondary'}>
                    {log.status}
                  </Badge>
                </div>
              );
            })}
            {logs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No medication logs yet</p>
                <p className="text-sm">Start tracking your medications to see activity here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddMedicationModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
      />
    </div>
  );
};

export default Dashboard;
