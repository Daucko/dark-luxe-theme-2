import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, FileText, Clock, Users, CheckCircle, AlertCircle, Search, Filter, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ViewAllAssignments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClass, setFilterClass] = useState("all");

  // Mock data - will be fetched from backend
  const assignments = [
    {
      id: 1,
      title: "Quadratic Equations Practice",
      subject: "Mathematics",
      teacher: "Prof. Sarah Johnson",
      class: "Class 10A",
      dueDate: "2024-03-20",
      totalPoints: 100,
      status: "active",
      submissions: 45,
      totalStudents: 50,
      graded: 30,
      createdAt: "2024-03-10"
    },
    {
      id: 2,
      title: "Chemical Bonding Lab Report",
      subject: "Chemistry",
      teacher: "Ms. Emily Williams",
      class: "Class 11B",
      dueDate: "2024-03-25",
      totalPoints: 50,
      status: "active",
      submissions: 38,
      totalStudents: 42,
      graded: 38,
      createdAt: "2024-03-12"
    },
    {
      id: 3,
      title: "Newton's Laws Assignment",
      subject: "Physics",
      teacher: "Dr. Michael Chen",
      class: "Class 9A",
      dueDate: "2024-03-18",
      totalPoints: 75,
      status: "active",
      submissions: 32,
      totalStudents: 38,
      graded: 20,
      createdAt: "2024-03-08"
    },
    {
      id: 4,
      title: "Cell Biology Quiz",
      subject: "Biology",
      teacher: "Mr. James Brown",
      class: "Class 10B",
      dueDate: "2024-03-15",
      totalPoints: 40,
      status: "completed",
      submissions: 40,
      totalStudents: 40,
      graded: 40,
      createdAt: "2024-03-01"
    },
    {
      id: 5,
      title: "Shakespeare Essay",
      subject: "English",
      teacher: "Mrs. Patricia Davis",
      class: "Class 12A",
      dueDate: "2024-03-30",
      totalPoints: 100,
      status: "active",
      submissions: 15,
      totalStudents: 35,
      graded: 0,
      createdAt: "2024-03-14"
    },
    {
      id: 6,
      title: "World War II Analysis",
      subject: "History",
      teacher: "Mr. Robert Wilson",
      class: "Class 11A",
      dueDate: "2024-03-22",
      totalPoints: 60,
      status: "active",
      submissions: 28,
      totalStudents: 32,
      graded: 15,
      createdAt: "2024-03-11"
    },
  ];

  const stats = {
    totalAssignments: assignments.length,
    activeAssignments: assignments.filter(a => a.status === "active").length,
    completedAssignments: assignments.filter(a => a.status === "completed").length,
    pendingGrading: assignments.reduce((sum, a) => sum + (a.submissions - a.graded), 0),
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "all" || assignment.subject === filterSubject;
    const matchesStatus = filterStatus === "all" || assignment.status === filterStatus;
    const matchesClass = filterClass === "all" || assignment.class === filterClass;
    
    return matchesSearch && matchesSubject && matchesStatus && matchesClass;
  });

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge variant="default">Active</Badge>;
    } else if (status === "completed") {
      return <Badge variant="secondary">Completed</Badge>;
    } else {
      return <Badge variant="outline">Draft</Badge>;
    }
  };

  const getDaysUntil = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return <span className="text-destructive">Overdue</span>;
    if (diffDays === 0) return <span className="text-destructive">Due today</span>;
    if (diffDays === 1) return <span className="text-orange-500">Due tomorrow</span>;
    return <span className="text-muted-foreground">{diffDays} days</span>;
  };

  const handleViewAssignment = (id: number) => {
    console.log("View assignment:", id);
    // Navigate to assignment details page
  };

  const handleEditAssignment = (id: number) => {
    console.log("Edit assignment:", id);
    // Navigate to edit assignment page
  };

  const handleDeleteAssignment = (id: number) => {
    console.log("Delete assignment:", id);
    // Show confirmation dialog and delete
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">All Assignments</h1>
              <p className="text-sm text-muted-foreground">
                Manage and view all assignments across the platform
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssignments}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAssignments}</div>
              <p className="text-xs text-muted-foreground">Currently ongoing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAssignments}</div>
              <p className="text-xs text-muted-foreground">Finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingGrading}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Assignments</CardTitle>
            <CardDescription>Search and filter assignments by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, teacher, or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
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

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Assignments Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assignments List</CardTitle>
                <CardDescription>
                  Showing {filteredAssignments.length} of {assignments.length} assignments
                </CardDescription>
              </div>
              <Button onClick={() => navigate("/teacher/create-assignment")}>
                <FileText className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No assignments found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {assignment.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{assignment.subject}</Badge>
                        </TableCell>
                        <TableCell>{assignment.teacher}</TableCell>
                        <TableCell>{assignment.class}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                            <span className="text-xs">{getDaysUntil(assignment.dueDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm">
                              {assignment.submissions}/{assignment.totalStudents} submitted
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {assignment.graded} graded
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewAssignment(assignment.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAssignment(assignment.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAssignment(assignment.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
