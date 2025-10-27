import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { Badge } from '@/components/ui/badge';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShineBorder } from '@/components/ui/shine-border';
import Footer from '@/components/Footer';
import LOGO from '@/assets/LearnSync-logo-transparent.png';

const Index = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const boxes = [
    {
      id: '1',
      role: 'For Teachers',
      description:
        'Create, distribute, and grade assignments effortlessly with integrated multimedia support',
    },
    {
      id: '2',
      role: 'For Students',
      description:
        'Access and submit assignments with ease, utilizing a user-friendly interface and real-time feedback',
    },
    {
      id: '3',
      role: 'For Admins',
      description:
        'Monitor performance, manage users, and gain insights with real-time analytics',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <img src={LOGO} alt="LearnSync Logo" className="size-28" />

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
              <Button
                variant="outline"
                size="icon"
                className="rounded-lg md:hidden"
              >
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

      <main className="relative">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[-55%] h-[200%] skew-y-12 absolute'
          )}
        />

        {/* Hero Section */}
        <section className="flex min-h-[calc(100dvh-4rem)] flex-1 flex-col justify-between gap-12 overflow-x-hidden pt-8 sm:gap-16 sm:pt-16 lg:gap-24 lg:pt-24 relative z-10">
          {/* Hero Content */}
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
            <div className="bg-muted flex items-center gap-2.5 rounded-full border px-3 py-2">
              <Badge className="rounded-full">Web-Powered</Badge>
              <span className="text-muted-foreground text-sm">
                Business Client Portal Solution
              </span>
            </div>

            <h1 className="text-3xl leading-[1.29167] font-bold text-balance sm:text-4xl lg:text-5xl">
              LearnSync: Interactive
              <br />
              <span className="relative">
                Assignment
                <svg
                  width="223"
                  height="12"
                  viewBox="0 0 223 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-x-0 bottom-0 w-full translate-y-1/2 max-sm:hidden"
                >
                  <path
                    d="M1.11716 10.428C39.7835 4.97282 75.9074 2.70494 114.894 1.98894C143.706 1.45983 175.684 0.313587 204.212 3.31596C209.925 3.60546 215.144 4.59884 221.535 5.74551"
                    stroke="url(#paint0_linear_10365_68643)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_10365_68643"
                      x1="18.8541"
                      y1="3.72033"
                      x2="42.6487"
                      y2="66.6308"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="var(--primary)" />
                      <stop offset="1" stopColor="var(--primary-foreground)" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{' '}
              & Tutorial Platform
            </h1>

            <p className="text-muted-foreground max-w-2xl text-lg">
              An educational platform for tutors to share assignments and
              tutorials, with seamless student submission.
              <br />
              Features real-time analytics and progress tracking for all users.
            </p>

            <Button
              size="lg"
              className="px-8 py-3 text-lg"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <div className="px-6 my-40 grid md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
          {boxes.map((box, index) => (
            <div
              key={box.id}
              className="relative w-full overflow-hidden p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
            >
              <ShineBorder
                shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']}
                className="rounded-2xl"
              />
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {box.role}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {box.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
