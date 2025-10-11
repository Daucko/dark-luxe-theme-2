import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState({ year: '2024-2025', term: 'FIRST' });
  const [termDialogOpen, setTermDialogOpen] = useState(false);
  const [newYear, setNewYear] = useState(currentSession.year);
  const [newTerm, setNewTerm] = useState(currentSession.term);

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
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Admin User</p>
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
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                  <SelectItem value="2026-2027">2026-2027</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Select value={newTerm} onValueChange={setNewTerm}>
                <SelectTrigger id="term">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
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
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Add Teacher
            </Button>
            <Button variant="secondary">
              <GraduationCap className="mr-2 h-4 w-4" />
              Add Student
            </Button>
            <Button variant="outline">
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