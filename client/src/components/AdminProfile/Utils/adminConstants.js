import { 
  BarChart3, 
  Award, 
  Users, 
  FileText, 
  Plus,
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Settings,
  History,
  Target,
  Globe,
  Wrench
} from 'lucide-react';

// Sample data
export const sampleAdminData = {
  user: {
    _id: "admin123",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@thinktank.org",
    role: "ADMIN",
    profilePicture: "https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=150&h=150&fit=crop&crop=face"
  },
  stats: {
    totalFellowships: 12,
    activeFellowships: 5,
    totalApplications: 247,
    pendingApplications: 18,
    acceptedApplications: 156,
    rejectedApplications: 73,
    totalRevenue: 12350,
    totalUsers: 423
  },
  pendingApplications: [
    {
      _id: "app1",
      applicant: {
        name: "John Smith",
        email: "john.smith@example.com",
        organization: "Global Research Institute",
        position: "Senior Researcher",
        experience: "5-10",
        linkedin: "https://linkedin.com/in/johnsmith"
      },
      fellowship: {
        _id: "fellowship1",
        title: "Climate Policy Initiative",
        cycle: "2024-Fall"
      },
      workgroup: {
        _id: "wg1",
        name: "Environmental Policy Research"
      },
      motivation: "I am passionate about environmental policy and have extensive experience in climate research...",
      status: "PENDING",
      submittedAt: "2024-08-10T14:30:00Z",
      paymentStatus: "COMPLETED",
      paymentId: "pi_test123"
    },
    {
      _id: "app2",
      applicant: {
        name: "Maria Garcia",
        email: "maria.garcia@university.edu",
        organization: "Academic Research Center",
        position: "Research Director",
        experience: "10-15",
        linkedin: "https://linkedin.com/in/mariagarcia"
      },
      fellowship: {
        _id: "fellowship2",
        title: "Global Policy Fellowship",
        cycle: "2024-Fall"
      },
      workgroup: {
        _id: "wg2",
        name: "Economic Development Research"
      },
      motivation: "My background in economic development aligns perfectly with this fellowship's objectives...",
      status: "PENDING",
      submittedAt: "2024-08-09T10:15:00Z",
      paymentStatus: "COMPLETED",
      paymentId: "pi_test456"
    },
    {
      _id: "app3",
      applicant: {
        name: "David Chen",
        email: "david.chen@techcorp.com",
        organization: "Technology Solutions Inc",
        position: "Innovation Director",
        experience: "8-12",
        linkedin: "https://linkedin.com/in/davidchen"
      },
      fellowship: {
        _id: "fellowship3",
        title: "Digital Transformation Fellowship",
        cycle: "2024-Fall"
      },
      workgroup: {
        _id: "wg3",
        name: "Technology Innovation Lab"
      },
      motivation: "With my extensive background in digital transformation and innovation management...",
      status: "ACCEPTED",
      submittedAt: "2024-08-08T09:20:00Z",
      paymentStatus: "COMPLETED",
      paymentId: "pi_test789"
    }
  ],
  pastFellowships: [
    {
      _id: "fellowship_past1",
      title: "International Relations Fellowship",
      description: "Comprehensive program on diplomatic relations and foreign policy",
      cycle: "2023-Fall",
      status: "COMPLETED",
      participantsCount: 18,
      completedAt: "2024-02-28T00:00:00Z"
    },
    {
      _id: "fellowship_past2",
      title: "Digital Governance Initiative",
      description: "Research program on digital policy and governance frameworks",
      cycle: "2023-Spring",
      status: "COMPLETED",
      participantsCount: 15,
      completedAt: "2023-08-15T00:00:00Z"
    }
  ]
};

export const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'fellowships', label: 'Add Fellowship', icon: Award },
    { id: 'workgroups', label: 'Add Workgroup', icon: Target },
    { id: 'moderation', label: 'Moderate Applications', icon: FileText },
    { id: 'future', label: 'Future Fellowships', icon: Calendar },
    { id: 'history', label: 'Past Fellowships', icon: History },
    {id:'onboarding', label: 'Onboarding Tracker', icon: Users},
    { id: 'manage-workgroups', label: 'Manage Workgroups', icon: Wrench },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
