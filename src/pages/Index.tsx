import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">eduassign</h1>
        <div className="flex items-center gap-3">
          {/* Desktop/Tablet Portal Buttons - hidden on mobile */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/student/dashboard')}
            className="hidden md:flex"
          >
            Student Portal
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/admin/dashboard')}
            className="hidden md:flex"
          >
            Teacher Portal
          </Button>
          <ThemeToggle />
          
          {/* Mobile Hamburger Menu - hidden on desktop/tablet */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-lg md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigate('/student/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  Student Portal
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigate('/admin/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  Teacher Portal
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12 md:py-20">
        <div className="bg-gradient-hero rounded-3xl p-12 md:p-20 shadow-2xl">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-tight">
              eduassign
            </h2>
            <p className="text-2xl md:text-3xl text-black/90 mb-12 leading-relaxed">
              Streamline assignment management for modern education
            </p>
            <Button
              size="lg"
              className="bg-black text-white hover:bg-black/90 text-lg px-8 py-6 rounded-xl"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h3 className="text-xl font-semibold mb-3">For Teachers</h3>
            <p className="text-muted-foreground">
              Create, distribute, and grade assignments effortlessly with integrated multimedia support
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h3 className="text-xl font-semibold mb-3">For Students</h3>
            <p className="text-muted-foreground">
              Access all assignments, submit work, and track progress in one unified platform
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h3 className="text-xl font-semibold mb-3">For Admins</h3>
            <p className="text-muted-foreground">
              Monitor performance, manage users, and gain insights with real-time analytics
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;