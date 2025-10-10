import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload, Video, CheckCircle, XCircle, Play, X } from "lucide-react";

export const UploadVideo = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [customSubject, setCustomSubject] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
  });

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        handleVideoFileChange(file);
      } else {
        toast.error("Invalid file type", {
          description: "Please upload a video file.",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
        });
      }
    }
  };

  const handleVideoFileChange = (file: File) => {
    setFormData({ ...formData, videoFile: file });
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const handleThumbnailFileChange = (file: File) => {
    setFormData({ ...formData, thumbnailFile: file });
    const url = URL.createObjectURL(file);
    setThumbnailPreview(url);
  };

  const handleSubjectChange = (value: string) => {
    setFormData({ ...formData, subject: value });
    // Clear custom subject if switching back to predefined subjects
    if (value !== "Other") {
      setCustomSubject("");
    }
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setFormData({ ...formData, videoFile: null });
    setVideoPreview(null);
  };

  const removeThumbnail = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setFormData({ ...formData, thumbnailFile: null });
    setThumbnailPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the final subject value (either selected or custom)
    const finalSubject = formData.subject === "Other" ? customSubject : formData.subject;

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required", {
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    if (!formData.videoFile) {
      toast.error("Video file is required", {
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    if (!finalSubject) {
      toast.error("Subject is required", {
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, you would upload to a server here
      console.log("Uploading video:", {
        ...formData,
        subject: finalSubject,
      });

      toast.success("Video uploaded successfully!", {
        description: `"${formData.title}" is now available to students.`,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        subject: "",
        videoFile: null,
        thumbnailFile: null,
      });
      setCustomSubject("");
      setVideoPreview(null);
      setThumbnailPreview(null);

      // Navigate back after short delay
      setTimeout(() => {
        navigate("/teacher/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("Upload failed", {
        description: "Please try again or contact support.",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/teacher/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Upload Video</h1>
          <p className="text-muted-foreground mt-2">
            Upload educational videos for your students
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Video Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Video File</CardTitle>
                <CardDescription>
                  Upload your video file (MP4, MOV, AVI, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!videoPreview ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleVideoDrop}
                  >
                    <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Drag and drop your video here, or click to browse
                      </p>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleVideoFileChange(file);
                        }}
                        className="max-w-xs mx-auto cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Supports: MP4, MOV, AVI, WMV (Max 500MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full max-h-96"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Play className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">
                            {formData.videoFile?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(formData.videoFile?.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeVideo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Details */}
            <Card>
              <CardHeader>
                <CardTitle>Video Details</CardTitle>
                <CardDescription>
                  Provide information about your video
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Introduction to Algebra"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn from this video..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">
                    Subject <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={handleSubjectChange}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
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
              </CardContent>
            </Card>

            {/* Thumbnail Upload (Optional) */}
            <Card>
              <CardHeader>
                <CardTitle>Thumbnail (Optional)</CardTitle>
                <CardDescription>
                  Upload a custom thumbnail image for your video
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!thumbnailPreview ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleThumbnailFileChange(file);
                      }}
                      className="max-w-xs mx-auto cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG, or GIF (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full max-h-48 object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeThumbnail}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove Thumbnail
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/teacher/dashboard")}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Video
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;