import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentSession, setCurrentSession] = useState({ year: '2024-2025', term: 'FIRST' });
  
  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user && user.role !== 'ADMIN') {
      // Redirect to appropriate dashboard based on role
      if (user.role === 'TEACHER') {
        navigate('/teacher/dashboard');
      } else if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      }
    }
  }, [user, loading, navigate]);
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

  const handleLogout = () => {
    navigate('/auth');
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
    // Validate form
    if (!teacherForm.name || !teacherForm.email || !teacherForm.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Adding teacher:', teacherForm);

    // Close dialog and show success message
    setAddTeacherDialogOpen(false);
    toast.success('Teacher added successfully', {
      description: `${teacherForm.name} has been added to the system`,
    });

    // Reset form
    setTeacherForm({ name: '', email: '', subject: '', phone: '' });
  };

  const handleAddStudent = () => {
    setStudentForm({ name: '', email: '', class: '', parentName: '', parentPhone: '' });
    setAddStudentDialogOpen(true);
  };

  const handleSaveStudent = () => {
    // Validate form
    if (!studentForm.name || !studentForm.class) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Adding student:', studentForm);

    // Close dialog and show success message
    setAddStudentDialogOpen(false);
    toast.success('Student added successfully', {
      description: `${studentForm.name} has been added to ${studentForm.class}`,
    });

    // Reset form
    setStudentForm({ name: '', email: '', class: '', parentName: '', parentPhone: '' });
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
                  <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.name || user?.email || 'Admin User'}</p>
                <Badge variant="default">Administrator</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Change Term Dialog */}
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
                  <SelectItem value="2026-2027">2026-2027</SelectItem>
                  <SelectItem value="2027-2028">2027-2028</SelectItem>
                  <SelectItem value="2028-2029">2028-2029</SelectItem>
                  <SelectItem value="2029-2030">2029-2030</SelectItem>
                  <SelectItem value="2030-2031">2030-2031</SelectItem>
                  <SelectItem value="2031-2032">2031-2032</SelectItem>
                  <SelectItem value="2032-2033">2032-2033</SelectItem>
                  <SelectItem value="2033-2034">2033-2034</SelectItem>
                  <SelectItem value="2034-2035">2034-2035</SelectItem>
                  <SelectItem value="2035-2036">2035-2036</SelectItem>
                  <SelectItem value="2036-2037">2036-2037</SelectItem>
                  <SelectItem value="2037-2038">2037-2038</SelectItem>
                  <SelectItem value="2038-2039">2038-2039</SelectItem>
                  <SelectItem value="2039-2040">2039-2040</SelectItem>
                  <SelectItem value="2040-2041">2040-2041</SelectItem>
                  <SelectItem value="2041-2042">2041-2042</SelectItem>
                  <SelectItem value="2042-2043">2042-2043</SelectItem>
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

      {/* Add Teacher Dialog */}
      <Dialog open={addTeacherDialogOpen} onOpenChange={setAddTeacherDialogOpen}>
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
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Physical Education">Physical Education</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
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

      {/* Add Student Dialog */}
      <Dialog open={addStudentDialogOpen} onOpenChange={setAddStudentDialogOpen}>
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
              <Label htmlFor="student-email">Email Address</Label>
              <Input
                id="student-email"
                type="email"
                placeholder="e.g., john.doe@student.edu"
                value={studentForm.email}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, email: e.target.value })
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
                  <SelectItem value="Class 6A">Class 6A</SelectItem>
                  <SelectItem value="Class 6B">Class 6B</SelectItem>
                  <SelectItem value="Class 7A">Class 7A</SelectItem>
                  <SelectItem value="Class 7B">Class 7B</SelectItem>
                  <SelectItem value="Class 8A">Class 8A</SelectItem>
                  <SelectItem value="Class 8B">Class 8B</SelectItem>
                  <SelectItem value="Class 9A">Class 9A</SelectItem>
                  <SelectItem value="Class 9B">Class 9B</SelectItem>
                  <SelectItem value="Class 10A">Class 10A</SelectItem>
                  <SelectItem value="Class 10B">Class 10B</SelectItem>
                  <SelectItem value="Class 11A">Class 11A</SelectItem>
                  <SelectItem value="Class 11B">Class 11B</SelectItem>
                  <SelectItem value="Class 11C">Class 11C</SelectItem>
                  <SelectItem value="Class 12A">Class 12A</SelectItem>
                  <SelectItem value="Class 12B">Class 12B</SelectItem>
                  <SelectItem value="Class 12C">Class 12C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent-name">Parent/Guardian Name (Optional)</Label>
              <Input
                id="parent-name"
                placeholder="e.g., Jane Doe"
                value={studentForm.parentName}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, parentName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent-phone">Parent/Guardian Phone (Optional)</Label>
              <Input
                id="parent-phone"
                type="tel"
                placeholder="e.g., +1 (555) 123-4567"
                value={studentForm.parentPhone}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, parentPhone: e.target.value })
                }
              />
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
        {/* Analytics Overview */}
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
              <p className="text-xs text-muted-foreground">Students enrolled</p>
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
              <p className="text-xs text-muted-foreground">
                {stats.activeTeachers} active this term
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Assignments
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssignments}</div>
              <p className="text-xs text-muted-foreground">Active this term</p>
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
              <p className="text-xs text-muted-foreground">
                Across all classes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Teacher-Specific Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Teachers
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTeachers}</div>
              <p className="text-xs text-muted-foreground">
                Currently teaching
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Grading
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingGrading}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting teacher review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Videos Uploaded
              </CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.videosUploaded}</div>
              <p className="text-xs text-muted-foreground">
                Learning resources
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Submissions Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">
                On-time submissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used admin actions</CardDescription>
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
            <Button variant="outline" onClick={() => navigate("/assignments")}>
              <FileText className="mr-2 h-4 w-4" />
              View All Assignments
            </Button>
            <Button variant="outline">
              <Video className="mr-2 h-4 w-4" />
              Manage Videos
            </Button>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Sessions
            </Button>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="teachers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
            <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
            <TabsTrigger value="activity">System Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="teachers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Management</CardTitle>
                <CardDescription>
                  Overview of all teachers and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {teacherStats.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{teacher.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{teacher.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {teacher.subject}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            teacher.status === 'active'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {teacher.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Students
                          </p>
                          <p className="text-lg font-semibold">
                            {teacher.students}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Assignments
                          </p>
                          <p className="text-lg font-semibold">
                            {teacher.assignments}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Avg Grade
                          </p>
                          <p className="text-lg font-semibold">
                            {teacher.avgGrade}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Pending
                          </p>
                          <p className="text-lg font-semibold text-orange-500">
                            {teacher.pendingGrading}
                          </p>
                        </div>
                        <div className="flex items-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate('/profile')}
                          >
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Grading Progress</span>
                          <span>
                            {Math.round(
                              ((teacher.assignments * 10 -
                                teacher.pendingGrading) /
                                (teacher.assignments * 10)) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            ((teacher.assignments * 10 -
                              teacher.pendingGrading) /
                              (teacher.assignments * 10)) *
                            100
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>
                  Latest student submissions across all teachers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {submission.student}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {submission.assignment}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Teacher: {submission.teacher}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.late && (
                          <Badge variant="destructive">Late</Badge>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {submission.time}
                        </p>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Assignments due soon across all classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{deadline.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {deadline.class}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Teacher: {deadline.teacher}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Due in {deadline.deadline}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {deadline.submissions}/{deadline.total} submitted
                          </p>
                          <Progress
                            value={
                              (deadline.submissions / deadline.total) * 100
                            }
                            className="w-24 h-2 mt-1"
                          />
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Activity</CardTitle>
                <CardDescription>
                  Recent platform activities and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between border-b pb-4 last:border-0"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {activity.user
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.user}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}