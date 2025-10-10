import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft, Calendar as CalendarIcon, Upload, CheckCircle, XCircle, Video, FileText } from "lucide-react";
import { format } from "date-fns";

export const CreateAssignment = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [customSubject, setCustomSubject] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    totalPoints: "",
    instructions: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectChange = (value: string) => {
    setFormData({
      ...formData,
      subject: value,
    });
    // Clear custom subject if switching back to predefined subjects
    if (value !== "Other") {
      setCustomSubject("");
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideoFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the final subject value (either selected or custom)
    const finalSubject = formData.subject === "Other" ? customSubject : formData.subject;

    // Validation
    if (!formData.title || !finalSubject || !date || !formData.totalPoints) {
      toast.error("Missing required fields!", {
        description: "Please fill in all required fields.",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    try {
      // TODO: Implement actual API call to save assignment
      console.log("Creating assignment:", {
        ...formData,
        subject: finalSubject,
        dueDate: date,
        attachments,
        videoFile,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Assignment created successfully!", {
        description: `"${formData.title}" has been published to students.`,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });

      // Navigate back to teacher dashboard
      navigate("/teacher/dashboard");
    } catch (error) {
      toast.error("Failed to create assignment!", {
        description: "Please try again or contact support.",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/teacher/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create Assignment</h1>
              <p className="text-sm text-muted-foreground">
                Add a new assignment for your students
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the essential details of the assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Assignment Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Quadratic Equations Practice"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the assignment"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">
                    Subject <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.subject} onValueChange={handleSubjectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Geography">Geography</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.subject === "Other" && (
                    <Input
                      placeholder="Enter custom subject"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      required
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalPoints">
                    Total Points <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="totalPoints"
                    name="totalPoints"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.totalPoints}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Due Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Instructions</CardTitle>
              <CardDescription>
                Provide clear instructions for students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  placeholder="Detailed instructions, requirements, and expectations..."
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Attachments & Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Attachments & Resources</CardTitle>
              <CardDescription>
                Upload reference materials, worksheets, or help videos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Attachments */}
              <div className="space-y-2">
                <Label htmlFor="attachments">Document Attachments</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={handleAttachmentChange}
                    className="cursor-pointer"
                  />
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                {attachments.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium">Attached Files:</p>
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted p-2 rounded"
                      >
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <Label htmlFor="video">Help Video (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="cursor-pointer"
                  />
                  <Video className="h-5 w-5 text-muted-foreground" />
                </div>
                {videoFile && (
                  <div className="flex items-center justify-between bg-muted p-2 rounded mt-2">
                    <span className="text-sm truncate">{videoFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeVideo}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload an instructional video to help students understand the assignment
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/teacher/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Upload className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;