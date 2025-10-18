import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { withStudentAuth } from '../components/withAuth';
import {
  FileText,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  BookOpen,
  Upload,
  XCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

// Define assignment type
interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: Date;
  maxMarks: number;
  status: 'pending' | 'submitted';
  hasVideo?: boolean;
  grade?: number;
}

function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mock data - replace with real API calls
  const stats = {
    completedAssignments: 32,
    pendingAssignments: 5,
    averageGrade: 85,
    videosWatched: 24,
  };

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'Math Homework - Quadratic Equations',
      subject: 'Mathematics',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      maxMarks: 50,
      status: 'pending',
      hasVideo: true,
    },
    {
      id: 2,
      title: 'Science Lab Report',
      subject: 'Science',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      maxMarks: 40,
      status: 'pending',
      hasVideo: true,
    },
    {
      id: 3,
      title: 'English Essay - Shakespeare',
      subject: 'English',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxMarks: 30,
      status: 'pending',
      hasVideo: false,
    },
    {
      id: 4,
      title: 'History Assignment',
      subject: 'History',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      maxMarks: 25,
      status: 'submitted',
      grade: 22,
    },
  ]);

  const videos = [
    {
      id: 1,
      title: 'Introduction to Quadratic Equations',
      duration: '12:30',
      views: 450,
    },
    { id: 2, title: 'Lab Safety Guidelines', duration: '8:15', views: 380 },
    {
      id: 3,
      title: "Shakespeare's Literary Techniques",
      duration: '15:45',
      views: 290,
    },
  ];

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: 'Overdue', variant: 'destructive' as const };
    if (days === 0)
      return { text: 'Due today', variant: 'destructive' as const };
    if (days === 1)
      return { text: 'Due tomorrow', variant: 'default' as const };
    return { text: `${days} days left`, variant: 'secondary' as const };
  };

  const handleSubmitWork = (assignmentId: number) => {
    setSelectedAssignment(assignmentId);
    setIsSubmitModalOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      const acceptedTypes = ['.pdf', '.doc', '.docx', '.txt'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (acceptedTypes.includes(fileExtension)) {
        setSelectedFile(file);
      } else {
        toast.error('Invalid file type', {
          description: 'Please upload PDF, DOC, DOCX, or TXT files only.',
        });
      }
    }
  };

  const handleSubmit = () => {
    if (selectedFile && selectedAssignment) {
      console.log(
        'Submitting file:',
        selectedFile.name,
        'for assignment:',
        selectedAssignment
      );

      try {
        // Update assignment status
        setAssignments((prev) =>
          prev.map((assignment) =>
            assignment.id === selectedAssignment
              ? {
                  ...assignment,
                  status: 'submitted' as 'pending' | 'submitted',
                }
              : assignment
          )
        );

        toast.success('Assignment submitted successfully!', {
          description: `${selectedFile.name} has been uploaded.`,
        });

        // Close modal and reset state
        setIsSubmitModalOpen(false);
        setSelectedFile(null);
        setSelectedAssignment(null);
      } catch (error) {
        toast.error('Submission failed!', {
          description: 'Please try again or contact support.',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="h-12 w-12 rounded-full cursor-pointer hover:opacity-80 transition-opacity object-cover"
                onClick={() => navigate('/profile')}
              />
            ) : (
              <div
                className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/profile')}
              >
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'S'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {user?.name || user?.email || 'Student'}!
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate('/profile')}>
              View Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completedAssignments}
              </div>
              <p className="text-xs text-muted-foreground">Assignments done</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.pendingAssignments}
              </div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Grade
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageGrade}%</div>
              <Progress value={stats.averageGrade} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Videos Watched
              </CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.videosWatched}</div>
              <p className="text-xs text-muted-foreground">
                Learning resources
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="assignments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assignments">Current Assignments</TabsTrigger>
            <TabsTrigger value="videos">Learning Resources</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {assignment.status === 'submitted' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-muted-foreground/30" />
                        )}
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            {assignment.title}
                          </CardTitle>
                          <CardDescription>
                            {assignment.subject}
                          </CardDescription>
                        </div>
                      </div>
                      {assignment.status === 'submitted' &&
                        assignment.grade && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                          >
                            {assignment.grade}/{assignment.maxMarks}
                          </Badge>
                        )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {assignment.status === 'pending' && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <Badge
                            variant={
                              getDaysUntilDeadline(assignment.dueDate).variant
                            }
                          >
                            {getDaysUntilDeadline(assignment.dueDate).text}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <FileText className="mr-2 h-4 w-4" />
                            View Assignment
                          </Button>
                          <Button
                            className="flex-1"
                            variant="secondary"
                            onClick={() => handleSubmitWork(assignment.id)}
                          >
                            Submit Work
                          </Button>
                        </div>
                        {assignment.hasVideo && (
                          <Button variant="outline" className="w-full">
                            <Play className="mr-2 h-4 w-4" />
                            Watch Help Video
                          </Button>
                        )}
                      </>
                    )}
                    {assignment.status === 'submitted' && (
                      <div className="space-y-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
                        >
                          Submitted
                        </Badge>
                        <Button variant="outline" className="w-full">
                          View Feedback
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Video Library</CardTitle>
                <CardDescription>
                  Instructional videos and hints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-24 rounded bg-muted flex items-center justify-center">
                          <Play className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{video.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {video.duration}
                            <span>•</span>
                            <span>{video.views} views</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        <Play className="mr-2 h-4 w-4" />
                        Watch
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Animated Hints</CardTitle>
                <CardDescription>AI-generated explanations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Hint videos will appear here when available</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
                <CardDescription>Your performance this term</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Overall Progress
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stats.averageGrade}%
                    </span>
                  </div>
                  <Progress value={stats.averageGrade} className="h-3" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Assignments Completed
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.completedAssignments}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      On-Time Submissions
                    </p>
                    <p className="text-2xl font-bold">95%</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-4">
                    Subject Performance
                  </h4>
                  <div className="space-y-4">
                    {['Mathematics', 'Science', 'English', 'History'].map(
                      (subject) => {
                        const grade = Math.floor(Math.random() * 20) + 75;
                        return (
                          <div key={subject} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{subject}</span>
                              <span className="text-sm text-muted-foreground">
                                {grade}%
                              </span>
                            </div>
                            <Progress value={grade} className="h-2" />
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Submit Work Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              Upload your completed assignment file. Accepted formats: PDF, DOC,
              DOCX, TXT
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Assignment File</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-2">
                  {isDragging
                    ? 'Drop file here'
                    : 'Drag and drop your file here'}
                </p>
                <p className="text-xs text-muted-foreground mb-4">or</p>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="cursor-pointer max-w-xs mx-auto"
                />
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedFile}>
              <Upload className="mr-2 h-4 w-4" />
              Submit Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStudentAuth(StudentDashboard);
