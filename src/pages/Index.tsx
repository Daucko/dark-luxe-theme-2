import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { Badge } from '@/components/ui/badge';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { ShineBorder } from '../components/ui/shine-border';
// import { MagicCard } from '../components/ui/magic-card';

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
        ' Monitor performance, manage users, and gain insights with real-time analytics',
    },
  ];

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
      <main>
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12'
          )}
        />

        {/* Hero Section */}
        <section className="flex min-h-[calc(100dvh-4rem)] flex-1 flex-col justify-between gap-12 overflow-x-hidden pt-8 sm:gap-16 sm:pt-16 lg:gap-24 lg:pt-24">
          {/* Hero Content */}
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
            <div className="bg-muted flex items-center gap-2.5 rounded-full border px-3 py-2">
              <Badge className="rounded-full">Web-Powered</Badge>
              <span className="text-muted-foreground">
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

            <p className="text-muted-foreground">
              An educational platform for tutors to share assignments and
              tutorials, with seamless student submission.
              <br />
              Features real-time analytics and progress tracking for all users.
            </p>

            {/* <Button size="lg" asChild>
            <a href="#">Try It Now</a>
          </Button> */}
            <Button size="lg" className="" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>

          {/* Image */}
          {/* <img
          src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/hero/image-19.png"
          alt="Dishes"
          className="min-h-67 w-full object-cover"
        /> */}
        </section>
        {/* Features Section */}
        {/* <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h3 className="text-xl font-semibold mb-3">For Teachers</h3>
            <p className="text-muted-foreground">
              Create, distribute, and grade assignments effortlessly with
              integrated multimedia support
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h3 className="text-xl font-semibold mb-3">For Students</h3>
            <p className="text-muted-foreground">
              Access all assignments, submit work, and track progress in one
              unified platform
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h3 className="text-xl font-semibold mb-3">For Admins</h3>
            <p className="text-muted-foreground">
              Monitor performance, manage users, and gain insights with
              real-time analytics
            </p>
          </div>
        </div> */}

        <div className="px-6 mt-10 grid md:grid-cols-3 gap-8">
          {boxes?.map((box, index) => {
            return (
              <div className="relative w-full max-w-[350px] overflow-hidden p-8 rounded-2xl bg-card">
                <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
                <h3 className="text-xl font-semibold mb-3">{box?.role}</h3>
                <p className="text-muted-foreground">{box?.description}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;
