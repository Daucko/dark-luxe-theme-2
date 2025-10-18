import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { withAdminAuth } from '../components/withAuth';
import {
  Users,
  FileText,
  Video,
  Calendar,
  Clock,
  TrendingUp,
  GraduationCap,
  UserCheck,
  AlertCircle,
  Award,
  LogOut,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentSession, setCurrentSession] = useState({
    year: '2024-2025',
    term: 'FIRST',
  });
  const [termDialogOpen, setTermDialogOpen] = useState(false);
  const [newYear, setNewYear] = useState(currentSession.year);
  const [newTerm, setNewTerm] = useState(currentSession.term);

  // Add Teacher Dialog State
  const [addTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
  });

  // Add Student Dialog State
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    class: '',
    parentName: '',
    parentPhone: '',
  });

  // Mock data - will be fetched from Vercel PostgreSQL backend
  const stats = {
    totalStudents: 450,
    totalTeachers: 28,
    totalAssignments: 85,
    pendingSubmissions: 23,
    averageGrade: 82,
    activeTeachers: 25,
    pendingGrading: 67,
    videosUploaded: 142,
  };

  const teacherStats = [
    {
      id: 1,
      name: 'Prof. Sarah Johnson',
      avatar: 'SJ',
      subject: 'Mathematics',
      students: 45,
      assignments: 12,
      avgGrade: 85,
      pendingGrading: 8,
      status: 'active',
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      avatar: 'MC',
      subject: 'Physics',
      students: 38,
      assignments: 10,
      avgGrade: 78,
      pendingGrading: 5,
      status: 'active',
    },
    {
      id: 3,
      name: 'Ms. Emily Williams',
      avatar: 'EW',
      subject: 'Chemistry',
      students: 42,
      assignments: 15,
      avgGrade: 82,
      pendingGrading: 12,
      status: 'active',
    },
    {
      id: 4,
      name: 'Mr. James Brown',
      avatar: 'JB',
      subject: 'Biology',
      students: 40,
      assignments: 8,
      avgGrade: 79,
      pendingGrading: 3,
      status: 'inactive',
    },
  ];

  const recentSubmissions = [
    {
      id: 1,
      student: 'John Doe',
      teacher: 'Prof. Sarah Johnson',
      assignment: 'Math Homework',
      time: '2 hours ago',
      late: false,
    },
    {
      id: 2,
      student: 'Jane Smith',
      teacher: 'Dr. Michael Chen',
      assignment: 'Science Project',
      time: '5 hours ago',
      late: true,
    },
    {
      id: 3,
      student: 'Mike Johnson',
      teacher: 'Ms. Emily Williams',
      assignment: 'English Essay',
      time: '1 day ago',
      late: false,
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Chemistry Lab Report',
      teacher: 'Ms. Emily Williams',
      class: 'Class 10A',
      deadline: '2 days',
      submissions: 18,
      total: 30,
    },
    {
      id: 2,
      title: 'History Assignment',
      teacher: 'Prof. Sarah Johnson',
      class: 'Class 9B',
      deadline: '5 days',
      submissions: 25,
      total: 28,
    },
    {
      id: 3,
      title: 'Physics Quiz',
      teacher: 'Dr. Michael Chen',
      class: 'Class 11C',
      deadline: '1 week',
      submissions: 12,
      total: 32,
    },
  ];

  const systemActivity = [
    {
      id: 1,
      action: 'Teacher created assignment',
      user: 'Prof. Sarah Johnson',
      details: 'Quadratic Equations Quiz',
      time: '1 hour ago',
    },
    {
      id: 2,
      action: 'New teacher registered',
      user: 'Dr. David Lee',
      details: 'Computer Science',
      time: '3 hours ago',
    },
    {
      id: 3,
      action: 'Video uploaded',
      user: 'Ms. Emily Williams',
      details: 'Chemical Bonding Tutorial',
      time: '5 hours ago',
    },
  ];

  // Use the logout function from useAuth hook
  const handleLogout = () => {
    logout(); // This will handle the logout and redirect properly
  };

  const handleChangeTerm = () => {
    setNewYear(currentSession.year);
    setNewTerm(currentSession.term);
    setTermDialogOpen(true);
  };

  const handleSaveSession = () => {
    setCurrentSession({ year: newYear, term: newTerm });
    setTermDialogOpen(false);
    toast.success('Session updated successfully', {
      description: `Now viewing ${newYear} - ${newTerm} term`,
    });
  };

  const handleAddTeacher = () => {
    setTeacherForm({ name: '', email: '', subject: '', phone: '' });
    setAddTeacherDialogOpen(true);
  };

  const handleSaveTeacher = () => {
    if (!teacherForm.name || !teacherForm.email || !teacherForm.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('Adding teacher:', teacherForm);
    setAddTeacherDialogOpen(false);
    toast.success('Teacher added successfully', {
      description: `${teacherForm.name} has been added to the system`,
    });

    setTeacherForm({ name: '', email: '', subject: '', phone: '' });
  };

  const handleAddStudent = () => {
    setStudentForm({
      name: '',
      email: '',
      class: '',
      parentName: '',
      parentPhone: '',
    });
    setAddStudentDialogOpen(true);
  };

  const handleSaveStudent = () => {
    if (!studentForm.name || !studentForm.class) {
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('Adding student:', studentForm);
    setAddStudentDialogOpen(false);
    toast.success('Student added successfully', {
      description: `${studentForm.name} has been added to ${studentForm.class}`,
    });

    setStudentForm({
      name: '',
      email: '',
      class: '',
      parentName: '',
      parentPhone: '',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Session: {currentSession.year} | Term: {currentSession.term}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleChangeTerm}>
              <Calendar className="mr-2 h-4 w-4" />
              Change Term
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <div className="flex items-center gap-2">
              <Avatar
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/profile')}
              >
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} />
                ) : (
                  <AvatarFallback>
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {user?.name || user?.email || 'Admin User'}
                </p>
                <Badge variant="default">Administrator</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dialogs */}
      <Dialog open={termDialogOpen} onOpenChange={setTermDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Academic Session</DialogTitle>
            <DialogDescription>
              Select the academic year and term you want to view
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="year">Academic Year</Label>
              <Select value={newYear} onValueChange={setNewYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Select value={newTerm} onValueChange={setNewTerm}>
                <SelectTrigger id="term">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="FIRST">First Term</SelectItem>
                  <SelectItem value="SECOND">Second Term</SelectItem>
                  <SelectItem value="THIRD">Third Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTermDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSession}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addTeacherDialogOpen}
        onOpenChange={setAddTeacherDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>
              Enter the teacher's information to add them to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="teacher-name"
                placeholder="e.g., Dr. John Smith"
                value={teacherForm.name}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="teacher-email"
                type="email"
                placeholder="e.g., john.smith@school.edu"
                value={teacherForm.email}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-subject">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Select
                value={teacherForm.subject}
                onValueChange={(value) =>
                  setTeacherForm({ ...teacherForm, subject: value })
                }
              >
                <SelectTrigger id="teacher-subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-phone">Phone Number (Optional)</Label>
              <Input
                id="teacher-phone"
                type="tel"
                placeholder="e.g., +1 (555) 123-4567"
                value={teacherForm.phone}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, phone: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddTeacherDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTeacher}>Add Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addStudentDialogOpen}
        onOpenChange={setAddStudentDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the student's information to add them to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student-name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="student-name"
                placeholder="e.g., John Doe"
                value={studentForm.name}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-class">
                Class <span className="text-destructive">*</span>
              </Label>
              <Select
                value={studentForm.class}
                onValueChange={(value) =>
                  setStudentForm({ ...studentForm, class: value })
                }
              >
                <SelectTrigger id="student-class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Class 10A">Class 10A</SelectItem>
                  <SelectItem value="Class 10B">Class 10B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddStudentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveStudent}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Teachers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssignments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Grade
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageGrade}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={handleAddTeacher}>
              <Users className="mr-2 h-4 w-4" />
              Add Teacher
            </Button>
            <Button variant="secondary" onClick={handleAddStudent}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboard);
