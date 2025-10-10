import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Users, 
  FileText, 
  Video, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  GraduationCap,
  LogOut
} from "lucide-react";
import type { Assignment, Submission } from "@/types";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data - will be fetched from Vercel PostgreSQL backend
  const teacherName = "Prof. Sarah Johnson";
  const currentSession = "2023-2024";
  const currentTerm = "First Term";
  
  const stats = {
    totalStudents: 156,
    activeAssignments: 8,
    pendingGrading: 23,
    averageClassGrade: 82
  };

  const myAssignments: Assignment[] = [
    {
      id: "1",
      title: "Quadratic Equations Practice",
      description: "Solve various quadratic equations",
      subject: "Mathematics",
      dueDate: "2024-03-20",
      totalPoints: 100,
      status: "active",
      submissionsCount: 45,
      gradedCount: 30
    },
    {
      id: "2",
      title: "Chemical Bonding Lab Report",
      description: "Submit lab observations and conclusions",
      subject: "Chemistry",
      dueDate: "2024-03-25",
      totalPoints: 50,
      status: "active",
      submissionsCount: 38,
      gradedCount: 38
    }
  ];

  const pendingSubmissions: Submission[] = [
    {
      id: "1",
      assignmentId: "1",
      assignmentTitle: "Quadratic Equations Practice",
      studentId: "s1",
      studentName: "John Doe",
      submittedAt: "2024-03-15T10:30:00",
      status: "submitted",
      files: ["solution.pdf"]
    },
    {
      id: "2",
      assignmentId: "1",
      assignmentTitle: "Quadratic Equations Practice",
      studentId: "s2",
      studentName: "Jane Smith",
      submittedAt: "2024-03-16T14:20:00",
      status: "submitted",
      files: ["answers.pdf"]
    }
  ];

  const recentActivity = [
    { student: "Emily Wilson", action: "Submitted", assignment: "Physics Lab Report", time: "2 hours ago" },
    { student: "Michael Brown", action: "Submitted", assignment: "Math Assignment 5", time: "5 hours ago" },
    { student: "Sarah Davis", action: "Viewed", assignment: "Chemistry Quiz", time: "1 day ago" }
  ];

  const handleLogout = () => {
    navigate("/auth");
  };

  const handleCreateAssignment = () => {
    navigate("/teacher/create-assignment");
  };

  const handleUploadVideo = () => {
    navigate("/teacher/upload-video");
  };

  const handleGradeSubmissions = () => {
    navigate("/teacher/grade-submissions");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {currentSession} • {currentTerm}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{teacherName}</p>
              <Badge variant="secondary">Teacher</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAssignments}</div>
              <p className="text-xs text-muted-foreground">Currently ongoing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingGrading}</div>
              <p className="text-xs text-muted-foreground">Submissions to grade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Class Grade</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageClassGrade}%</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={handleCreateAssignment}>
              <FileText className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
            <Button onClick={handleUploadVideo} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
            <Button onClick={handleGradeSubmissions} variant="outline">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Grade Submissions
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              View Students
            </Button>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="assignments">My Assignments</TabsTrigger>
            <TabsTrigger value="grading">Pending Grading</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            {myAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{assignment.title}</CardTitle>
                      <CardDescription>{assignment.description}</CardDescription>
                    </div>
                    <Badge>{assignment.subject}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.submissionsCount} submissions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.gradedCount} graded</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Grading Progress</span>
                        <span>{Math.round((assignment.gradedCount! / assignment.submissionsCount!) * 100)}%</span>
                      </div>
                      <Progress value={(assignment.gradedCount! / assignment.submissionsCount!) * 100} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">View Details</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Grade Submissions</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="grading" className="space-y-4">
            {pendingSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{submission.studentName}</CardTitle>
                      <CardDescription>{submission.assignmentTitle}</CardDescription>
                    </div>
                    <Badge variant="secondary">{submission.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Submitted {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'N/A'}</span>
                    </div>
                    <Button size="sm">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Grade Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>My Students</CardTitle>
                <CardDescription>Manage and view student progress</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Student list will be populated from Vercel PostgreSQL backend</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest student actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{activity.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{activity.student}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.action} • {activity.assignment}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
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
};

export default TeacherDashboard;