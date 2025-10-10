import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, FileText, User, Calendar, CheckCircle, Clock, Download } from "lucide-react";

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  assignmentTitle: string;
  submittedDate: string;
  status: "pending" | "graded";
  grade?: number;
  feedback?: string;
  fileUrl?: string;
  fileName?: string;
}

export const GradeSubmissions = () => {
  const navigate = useNavigate();
  
  // Mock submission data
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "1",
      studentName: "John Doe",
      studentId: "STU001",
      assignmentTitle: "Mathematics Assignment 1",
      submittedDate: "2024-01-15",
      status: "pending",
      fileName: "math_assignment.pdf"
    },
    {
      id: "2",
      studentName: "Jane Smith",
      studentId: "STU002",
      assignmentTitle: "Science Lab Report",
      submittedDate: "2024-01-14",
      status: "pending",
      fileName: "lab_report.docx"
    },
    {
      id: "3",
      studentName: "Mike Johnson",
      studentId: "STU003",
      assignmentTitle: "History Essay",
      submittedDate: "2024-01-13",
      status: "graded",
      grade: 85,
      feedback: "Great work! Well-researched and structured.",
      fileName: "history_essay.pdf"
    },
    {
      id: "4",
      studentName: "Sarah Williams",
      studentId: "STU004",
      assignmentTitle: "Mathematics Assignment 1",
      submittedDate: "2024-01-15",
      status: "pending",
      fileName: "math_hw.pdf"
    }
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({
    grade: "",
    feedback: ""
  });
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "graded">("all");

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

    toast.success("Grade submitted successfully!");
    setSelectedSubmission(null);
    setGradeData({ grade: "", feedback: "" });
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus === "all") return true;
    return sub.status === filterStatus;
  });

  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const gradedCount = submissions.filter(s => s.status === "graded").length;

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
                Grade Submissions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Review and grade student assignments
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{gradedCount}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Graded</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Submissions</CardTitle>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="graded">Graded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Click on a submission to grade it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No submissions found
                  </div>
                ) : (
                  filteredSubmissions.map(submission => (
                    <Card
                      key={submission.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedSubmission?.id === submission.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => handleSelectSubmission(submission)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
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
                                Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
                              </span>
                            </div>
                            {submission.grade !== undefined && (
                              <div className="mt-2">
                                <span className="text-sm font-semibold text-green-600">
                                  Grade: {submission.grade}/100
                                </span>
                              </div>
                            )}
                          </div>
                          <Badge
                            variant={submission.status === "graded" ? "default" : "secondary"}
                            className={
                              submission.status === "graded"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-orange-500 hover:bg-orange-600"
                            }
                          >
                            {submission.status === "graded" ? "Graded" : "Pending"}
                          </Badge>
                        </div>
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Student:</span>
                      <span className="font-semibold">{selectedSubmission.studentName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Assignment:</span>
                      <span className="font-semibold">{selectedSubmission.assignmentTitle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Submitted:</span>
                      <span className="font-semibold">
                        {new Date(selectedSubmission.submittedDate).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedSubmission.fileName && (
                      <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Attachment:</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          {selectedSubmission.fileName}
                        </Button>
                      </div>
                    )}
                  </div>

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
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select a submission from the list to begin grading</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GradeSubmissions;