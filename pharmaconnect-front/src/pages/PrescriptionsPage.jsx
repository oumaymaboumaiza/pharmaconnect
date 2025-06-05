import { useState } from 'react';
import { 
  Pill, 
  Search, 
  Calendar,
  User,
  Clock,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: "John Doe",
      patientId: "P123456",
      age: 45,
      doctorName: "Dr. Sarah Smith",
      date: new Date(2024, 2, 15),
      status: "completed",
      medications: [
        { name: "Amoxicillin", dosage: "500mg", frequency: "3x daily", duration: "7 days", notes: "Take with food" },
        { name: "Ibuprofen", dosage: "400mg", frequency: "as needed", duration: "5 days", notes: "Maximum 3 times per day" }
      ],
      pharmacy: "Central Pharmacy",
      diagnosis: "Bacterial Infection",
      followUp: new Date(2024, 2, 22)
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientId: "P789012",
      age: 32,
      doctorName: "Dr. Michael Johnson",
      date: new Date(2024, 2, 14),
      status: "pending",
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "1x daily", duration: "30 days", notes: "Take in the morning" },
        { name: "Metformin", dosage: "500mg", frequency: "2x daily", duration: "30 days", notes: "Take with meals" }
      ],
      pharmacy: "HealthCare Pharmacy",
      diagnosis: "Hypertension, Type 2 Diabetes",
      followUp: new Date(2024, 3, 14)
    },
    {
      id: 3,
      patientName: "Robert Wilson",
      patientId: "P345678",
      age: 58,
      doctorName: "Dr. Emily Brown",
      date: new Date(2024, 2, 10),
      status: "completed",
      medications: [
        { name: "Atorvastatin", dosage: "20mg", frequency: "1x daily", duration: "90 days", notes: "Take in the evening" }
      ],
      pharmacy: "Community Wellness",
      diagnosis: "Hypercholesterolemia",
      followUp: new Date(2024, 5, 10)
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <AlertCircle className="text-yellow-500" />;
      case 'completed':
        return <CheckCircle2 className="text-green-500" />;
      case 'rejected':
        return <XCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Prescription History
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by patient or doctor..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPrescriptions.map(prescription => (
            <div key={prescription.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="bg-blue-100 text-blue-800 rounded-full h-12 w-12 flex items-center justify-center font-bold">
                      {prescription.patientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{prescription.patientName}</h3>
                      <p className="text-sm text-gray-600">Patient ID: {prescription.patientId}</p>
                      <p className="text-sm text-gray-600">Age: {prescription.age}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(prescription.status)}`}>
                    {getStatusIcon(prescription.status)}
                    <span className="text-sm capitalize">{prescription.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Prescription Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Doctor: {prescription.doctorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Date: {format(prescription.date, 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-gray-500" />
                        <span>Pharmacy: {prescription.pharmacy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Follow-up: {format(prescription.followUp, 'PPP')}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Medications</h4>
                    <div className="space-y-3">
                      {prescription.medications.map((med, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <div className="font-medium text-gray-900">{med.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>Dosage: {med.dosage}</p>
                            <p>Frequency: {med.frequency}</p>
                            <p>Duration: {med.duration}</p>
                            {med.notes && <p className="text-gray-500 italic mt-1">{med.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">Diagnosis:</span>
                      <span className="ml-2 text-gray-600">{prescription.diagnosis}</span>
                    </div>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}