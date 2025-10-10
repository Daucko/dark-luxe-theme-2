import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Download,
  Search,
  Filter,
  TrendingUp,
  Award,
  AlertCircle
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  assignmentTitle: string;
  assignmentId: string;
  submittedDate: string;
  dueDate: string;
  status: "pending" | "graded" | "late";
  grade?: number;
  feedback?: string;
  fileUrl?: string;
  fileName?: string;
  submissionText?: string;
}

interface Assignment {
  id: string;
  title: string;
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingSubmissions: number;
  averageGrade?: number;
}

export const GradeAssignments = () => {
  const navigate = useNavigate();
  
  // Mock assignments data
  const [assignments] = useState<Assignment[]>([
    {
      id: "A001",
      title: "Mathematics Assignment 1",
      totalSubmissions: 25,
      gradedSubmissions: 15,
      pendingSubmissions: 10,
      averageGrade: 78.5
    },
    {
      id: "A002",
      title: "Science Lab Report",
      totalSubmissions: 23,
      gradedSubmissions: 20,
      pendingSubmissions: 3,
      averageGrade: 82.3
    },
    {
      id: "A003",
      title: "History Essay",
      totalSubmissions: 28,
      gradedSubmissions: 28,
      pendingSubmissions: 0,
      averageGrade: 85.7
    },
    {
      id: "A004",
      title: "Programming Project",
      totalSubmissions: 20,
      gradedSubmissions: 5,
      pendingSubmissions: 15,
      averageGrade: 88.2
    }
  ]);

  // Mock submission data
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "1",
      studentName: "John Doe",
      studentId: "STU001",
      studentEmail: "john.doe@school.edu",
      assignmentTitle: "Mathematics Assignment 1",
      assignmentId: "A001",
      submittedDate: "2024-01-15T10:30:00",
      dueDate: "2024-01-15T23:59:00",
      status: "pending",
      fileName: "math_assignment.pdf",
      submissionText: "Completed all problems with detailed solutions."
    },
    {
      id: "2",
      studentName: "Jane Smith",
      studentId: "STU002",
      studentEmail: "jane.smith@school.edu",
      assignmentTitle: "Science Lab Report",
      assignmentId: "A002",
      submittedDate: "2024-01-14T14:20:00",
      dueDate: "2024-01-14T23:59:00",
      status: "pending",
      fileName: "lab_report.docx",
      submissionText: "Lab report with experimental data and analysis."
    },
    {
      id: "3",
      studentName: "Mike Johnson",
      studentId: "STU003",
      studentEmail: "mike.johnson@school.edu",
      assignmentTitle: "History Essay",
      assignmentId: "A003",
      submittedDate: "2024-01-13T16:45:00",
      dueDate: "2024-01-13T23:59:00",
      status: "graded",
      grade: 85,
      feedback: "Great work! Well-researched and structured. Your analysis of the historical events was thorough and insightful.",
      fileName: "history_essay.pdf"
    },
    {
      id: "4",
      studentName: "Sarah Williams",
      studentId: "STU004",
      studentEmail: "sarah.williams@school.edu",
      assignmentTitle: "Mathematics Assignment 1",
      assignmentId: "A001",
      submittedDate: "2024-01-16T08:15:00",
      dueDate: "2024-01-15T23:59:00",
      status: "late",
      fileName: "math_hw.pdf",
      submissionText: "Sorry for the late submission. Had technical difficulties."
    },
    {
      id: "5",
      studentName: "David Brown",
      studentId: "STU005",
      studentEmail: "david.brown@school.edu",
      assignmentTitle: "Programming Project",
      assignmentId: "A004",
      submittedDate: "2024-01-12T20:30:00",
      dueDate: "2024-01-12T23:59:00",
      status: "pending",
      fileName: "project.zip",
      submissionText: "Complete project with source code and documentation."
    }
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({
    grade: "",
    feedback: ""
  });
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "graded" | "late">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<string>("all");

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      grade: submission.grade?.toString() || "",
      feedback: submission.feedback || ""
    });
  };

  const handleGradeChange = (field: string, value: string) => {
    setGradeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitGrade = () => {
    if (!selectedSubmission) return;

    const grade = parseFloat(gradeData.grade);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      toast.error("Please enter a valid grade between 0 and 100");
      return;
    }

    if (!gradeData.feedback.trim()) {
      toast.error("Please provide feedback for the student");
      return;
    }

    // Update submission with grade
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === selectedSubmission.id
          ? {
              ...sub,
              grade,
              feedback: gradeData.feedback,
              status: "graded" as const
            }
          : sub
      )
    );

    toast.success(`Grade submitted for ${selectedSubmission.studentName}!`);
    setSelectedSubmission(null);
    setGradeData({ grade: "", feedback: "" });
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
    const matchesSearch = 
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignment = selectedAssignment === "all" || sub.assignmentId === selectedAssignment;
    
    return matchesStatus && matchesSearch && matchesAssignment;
  });

  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const gradedCount = submissions.filter(s => s.status === "graded").length;
  const lateCount = submissions.filter(s => s.status === "late").length;
  const totalSubmissions = submissions.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "graded":
        return "bg-green-500 hover:bg-green-600";
      case "pending":
        return "bg-orange-500 hover:bg-orange-600";
      case "late":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600 dark:text-green-400";
    if (grade >= 80) return "text-blue-600 dark:text-blue-400";
    if (grade >= 70) return "text-yellow-600 dark:text-yellow-400";
    if (grade >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
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
                Grade Assignments
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Review and grade student submissions
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalSubmissions}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
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
                  <p className="text-2xl font-bold">{gradedCount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Graded</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{lateCount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Late</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="overview">Assignment Overview</TabsTrigger>
          </TabsList>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submissions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Submissions</CardTitle>
                  <CardDescription>
                    Click on a submission to grade it
                  </CardDescription>
                  
                  {/* Filters */}
                  <div className="space-y-3 pt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by student name, ID, or assignment..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="graded">Graded</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Filter by assignment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Assignments</SelectItem>
                          {assignments.map(assignment => (
                            <SelectItem key={assignment.id} value={assignment.id}>
                              {assignment.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredSubmissions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No submissions found</p>
                      </div>
                    ) : (
                      filteredSubmissions.map(submission => (
                        <Card
                          key={submission.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedSubmission?.id === submission.id
                              ? "ring-2 ring-blue-500 dark:ring-blue-400"
                              : ""
                          }`}
                          onClick={() => handleSelectSubmission(submission)}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-semibold">
                                    {submission.studentName}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {submission.studentId}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {submission.assignmentTitle}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-xs text-gray-500">
                                    Submitted: {new Date(submission.submittedDate).toLocaleString()}
                                  </span>
                                </div>
                                {submission.grade !== undefined && (
                                  <div className="mt-2">
                                    <span className={`text-sm font-semibold ${getGradeColor(submission.grade)}`}>
                                      Grade: {submission.grade}/100
                                    </span>
                                  </div>
                                )}
                              </div>
                              <Badge
                                variant="default"
                                className={getStatusColor(submission.status)}
                              >
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </Badge>
                            </div>
                            {submission.fileName && (
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {submission.fileName}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Grading Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>Grade Submission</CardTitle>
                  <CardDescription>
                    {selectedSubmission
                      ? `Grading ${selectedSubmission.studentName}'s submission`
                      : "Select a submission to grade"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedSubmission ? (
                    <div className="space-y-6">
                      {/* Student Info */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Student:</span>
                          <span className="font-semibold">{selectedSubmission.studentName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Student ID:</span>
                          <span className="font-semibold">{selectedSubmission.studentId}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                          <span className="font-semibold text-sm">{selectedSubmission.studentEmail}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Assignment:</span>
                          <span className="font-semibold">{selectedSubmission.assignmentTitle}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Submitted:</span>
                          <span className="font-semibold text-sm">
                            {new Date(selectedSubmission.submittedDate).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Due Date:</span>
                          <span className="font-semibold text-sm">
                            {new Date(selectedSubmission.dueDate).toLocaleString()}
                          </span>
                        </div>
                        {selectedSubmission.status === "late" && (
                          <div className="pt-2 border-t dark:border-gray-700">
                            <Badge variant="destructive" className="w-full justify-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Late Submission
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Submission Content */}
                      {selectedSubmission.submissionText && (
                        <div className="space-y-2">
                          <Label>Submission Notes:</Label>
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                            {selectedSubmission.submissionText}
                          </div>
                        </div>
                      )}

                      {/* File Attachment */}
                      {selectedSubmission.fileName && (
                        <div className="space-y-2">
                          <Label>Attachment:</Label>
                          <Button variant="outline" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            {selectedSubmission.fileName}
                          </Button>
                        </div>
                      )}

                      {/* Grade Input */}
                      <div className="space-y-2">
                        <Label htmlFor="grade">
                          Grade (0-100) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="grade"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter grade"
                          value={gradeData.grade}
                          onChange={(e) => handleGradeChange("grade", e.target.value)}
                        />
                      </div>

                      {/* Feedback */}
                      <div className="space-y-2">
                        <Label htmlFor="feedback">
                          Feedback <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="feedback"
                          placeholder="Provide detailed feedback for the student..."
                          value={gradeData.feedback}
                          onChange={(e) => handleGradeChange("feedback", e.target.value)}
                          rows={6}
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        onClick={handleSubmitGrade}
                        className="w-full"
                        size="lg"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Submit Grade
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[500px] text-gray-500">
                      <div className="text-center">
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Select a submission from the list to begin grading</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assignment Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map(assignment => {
                const progressPercentage = (assignment.gradedSubmissions / assignment.totalSubmissions) * 100;
                
                return (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Assignment ID: {assignment.id}
                          </CardDescription>
                        </div>
                        {assignment.averageGrade && (
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-yellow-500" />
                              <span className={`text-2xl font-bold ${getGradeColor(assignment.averageGrade)}`}>
                                {assignment.averageGrade.toFixed(1)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Avg Grade</p>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Grading Progress</span>
                          <span className="font-semibold">
                            {assignment.gradedSubmissions}/{assignment.totalSubmissions}
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <p className="text-xs text-gray-500 text-right">
                          {progressPercentage.toFixed(0)}% Complete
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {assignment.totalSubmissions}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            {assignment.gradedSubmissions}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Graded</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            {assignment.pendingSubmissions}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setSelectedAssignment(assignment.id);
                          document.querySelector('[value="submissions"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        }}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Submissions
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GradeAssignments;
