import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Search, 
  Users,
  Mail,
  Calendar,
  Award,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  GraduationCap
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  class: string;
  gender: string;
  phone?: string;
  enrollmentDate: string;
  profileImage?: string;
  averageGrade: number;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  lateSubmissions: number;
  attendanceRate: number;
  status: "active" | "inactive";
}

interface StudentPerformance {
  assignmentTitle: string;
  submittedDate: string;
  grade: number;
  status: "graded" | "pending" | "late";
}

export const ViewStudents = () => {
  const navigate = useNavigate();
  
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@school.edu",
      studentId: "STU001",
      class: "Grade 10A",
      gender: "Male",
      phone: "+1 234-567-8901",
      enrollmentDate: "2023-09-01",
      averageGrade: 85.5,
      totalAssignments: 25,
      completedAssignments: 23,
      pendingAssignments: 2,
      lateSubmissions: 3,
      attendanceRate: 95,
      status: "active"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@school.edu",
      studentId: "STU002",
      class: "Grade 10A",
      gender: "Female",
      phone: "+1 234-567-8902",
      enrollmentDate: "2023-09-01",
      averageGrade: 92.3,
      totalAssignments: 25,
      completedAssignments: 25,
      pendingAssignments: 0,
      lateSubmissions: 0,
      attendanceRate: 98,
      status: "active"
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@school.edu",
      studentId: "STU003",
      class: "Grade 10B",
      gender: "Male",
      phone: "+1 234-567-8903",
      enrollmentDate: "2023-09-01",
      averageGrade: 78.7,
      totalAssignments: 24,
      completedAssignments: 20,
      pendingAssignments: 4,
      lateSubmissions: 5,
      attendanceRate: 88,
      status: "active"
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.williams@school.edu",
      studentId: "STU004",
      class: "Grade 10A",
      gender: "Female",
      phone: "+1 234-567-8904",
      enrollmentDate: "2023-09-01",
      averageGrade: 88.9,
      totalAssignments: 25,
      completedAssignments: 24,
      pendingAssignments: 1,
      lateSubmissions: 1,
      attendanceRate: 96,
      status: "active"
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@school.edu",
      studentId: "STU005",
      class: "Grade 10B",
      gender: "Male",
      phone: "+1 234-567-8905",
      enrollmentDate: "2023-09-01",
      averageGrade: 91.2,
      totalAssignments: 24,
      completedAssignments: 24,
      pendingAssignments: 0,
      lateSubmissions: 2,
      attendanceRate: 97,
      status: "active"
    },
    {
      id: "6",
      name: "Emily Davis",
      email: "emily.davis@school.edu",
      studentId: "STU006",
      class: "Grade 10A",
      gender: "Female",
      phone: "+1 234-567-8906",
      enrollmentDate: "2023-09-01",
      averageGrade: 76.4,
      totalAssignments: 25,
      completedAssignments: 21,
      pendingAssignments: 4,
      lateSubmissions: 6,
      attendanceRate: 85,
      status: "active"
    },
    {
      id: "7",
      name: "Robert Wilson",
      email: "robert.wilson@school.edu",
      studentId: "STU007",
      class: "Grade 10B",
      gender: "Male",
      phone: "+1 234-567-8907",
      enrollmentDate: "2023-09-01",
      averageGrade: 83.6,
      totalAssignments: 24,
      completedAssignments: 22,
      pendingAssignments: 2,
      lateSubmissions: 4,
      attendanceRate: 92,
      status: "active"
    },
    {
      id: "8",
      name: "Lisa Anderson",
      email: "lisa.anderson@school.edu",
      studentId: "STU008",
      class: "Grade 10A",
      gender: "Female",
      phone: "+1 234-567-8908",
      enrollmentDate: "2023-09-01",
      averageGrade: 94.1,
      totalAssignments: 25,
      completedAssignments: 25,
      pendingAssignments: 0,
      lateSubmissions: 0,
      attendanceRate: 99,
      status: "active"
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const studentPerformance: StudentPerformance[] = [
    { assignmentTitle: "Mathematics Assignment 1", submittedDate: "2024-01-15", grade: 88, status: "graded" },
    { assignmentTitle: "Science Lab Report", submittedDate: "2024-01-14", grade: 92, status: "graded" },
    { assignmentTitle: "History Essay", submittedDate: "2024-01-13", grade: 85, status: "graded" },
    { assignmentTitle: "Programming Project", submittedDate: "2024-01-12", grade: 90, status: "graded" },
    { assignmentTitle: "English Literature", submittedDate: "2024-01-10", grade: 78, status: "graded" }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === "all" || student.class === filterClass;
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "grade":
        return b.averageGrade - a.averageGrade;
      case "attendance":
        return b.attendanceRate - a.attendanceRate;
      case "studentId":
        return a.studentId.localeCompare(b.studentId);
      default:
        return 0;
    }
  });

  const uniqueClasses = Array.from(new Set(students.map(s => s.class)));

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600 dark:text-green-400";
    if (grade >= 80) return "text-blue-600 dark:text-blue-400";
    if (grade >= 70) return "text-yellow-600 dark:text-yellow-400";
    if (grade >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return "text-green-600 dark:text-green-400";
    if (rate >= 85) return "text-blue-600 dark:text-blue-400";
    if (rate >= 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const exportStudentData = () => {
    toast.success("Student data exported successfully!");
  };

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  const averageClassGrade = students.reduce((sum, s) => sum + s.averageGrade, 0) / students.length;
  const averageAttendance = students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/teacher/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                View Students
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and monitor student performance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={exportStudentData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeStudents}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{averageClassGrade.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Class Grade</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{averageAttendance.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="studentId">Student ID</SelectItem>
                  <SelectItem value="grade">Average Grade</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStudents.map(student => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.profileImage} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>{student.studentId}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={student.status === "active" ? "default" : "secondary"}>
                    {student.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <GraduationCap className="h-4 w-4" />
                    <span>{student.class}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Grade</span>
                    <span className={`text-lg font-bold ${getGradeColor(student.averageGrade)}`}>
                      {student.averageGrade.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Attendance</span>
                    <span className={`text-lg font-bold ${getAttendanceColor(student.attendanceRate)}`}>
                      {student.attendanceRate}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Assignments</span>
                      <span className="font-semibold">
                        {student.completedAssignments}/{student.totalAssignments}
                      </span>
                    </div>
                    <Progress 
                      value={(student.completedAssignments / student.totalAssignments) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t dark:border-gray-700">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-lg font-bold text-orange-600">{student.pendingAssignments}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Late</p>
                    <p className="text-lg font-bold text-red-600">{student.lateSubmissions}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Done</p>
                    <p className="text-lg font-bold text-green-600">{student.completedAssignments}</p>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.profileImage} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{student.name}</div>
                          <div className="text-sm font-normal text-gray-500">{student.studentId}</div>
                        </div>
                      </DialogTitle>
                      <DialogDescription>
                        Detailed student information and performance
                      </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="info" className="mt-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="info">Information</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="assignments">Assignments</TabsTrigger>
                      </TabsList>

                      <TabsContent value="info" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Personal Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-gray-600 dark:text-gray-400">Full Name</Label>
                                <p className="font-semibold">{student.name}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600 dark:text-gray-400">Student ID</Label>
                                <p className="font-semibold">{student.studentId}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600 dark:text-gray-400">Email</Label>
                                <p className="font-semibold">{student.email}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600 dark:text-gray-400">Phone</Label>
                                <p className="font-semibold">{student.phone || "N/A"}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600 dark:text-gray-400">Class</Label>
                                <p className="font-semibold">{student.class}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600 dark:text-gray-400">Gender</Label>
                                <p className="font-semibold">{student.gender}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600 dark:text-gray-400">Enrollment Date</Label>
                                <p className="font-semibold">
                                  {new Date(student.enrollmentDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <Label className="text-gray-600 dark:text-gray-400">Status</Label>
                                <Badge variant={student.status === "active" ? "default" : "secondary"}>
                                  {student.status}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="performance" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Award className="h-5 w-5 text-yellow-500" />
                                Academic Performance
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className={`text-4xl font-bold ${getGradeColor(student.averageGrade)}`}>
                                {student.averageGrade.toFixed(1)}%
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Average Grade
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                Attendance Rate
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className={`text-4xl font-bold ${getAttendanceColor(student.attendanceRate)}`}>
                                {student.attendanceRate}%
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Overall Attendance
                              </p>
                            </CardContent>
                          </Card>
                        </div>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Assignment Statistics</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <FileText className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                                <p className="text-2xl font-bold">{student.totalAssignments}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                              </div>
                              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                                <p className="text-2xl font-bold">{student.completedAssignments}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
                              </div>
                              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                                <p className="text-2xl font-bold">{student.pendingAssignments}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                              </div>
                              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
                                <p className="text-2xl font-bold">{student.lateSubmissions}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Late</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="assignments" className="space-y-3">
                        {studentPerformance.map((perf, index) => (
                          <Card key={index}>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold">{perf.assignmentTitle}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Submitted: {new Date(perf.submittedDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className={`text-2xl font-bold ${getGradeColor(perf.grade)}`}>
                                    {perf.grade}%
                                  </div>
                                  <Badge variant={perf.status === "graded" ? "default" : "secondary"}>
                                    {perf.status}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewStudents;
