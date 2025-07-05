
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Clock, Users, Settings, Smartphone, Mic, Timer, BarChart3 } from "lucide-react";
import TimerControl from "@/components/TimerControl";
import AppManager from "@/components/AppManager";
import UsageAnalytics from "@/components/UsageAnalytics";
import AuthenticationMode from "@/components/AuthenticationMode";
import ParentDashboard from "@/components/ParentDashboard";
import DeviceLockScreen from "@/components/DeviceLockScreen";
import NotificationManager from "@/components/NotificationManager";
import { SecurityProvider, useSecurityContext } from "@/contexts/SecurityContext";

const AppContent = () => {
  const [currentMode, setCurrentMode] = useState<'parent' | 'child'>('parent');
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const { isParentAuthenticated, isSessionValid } = useSecurityContext();

  // Determine actual mode based on authentication
  const effectiveMode = (isParentAuthenticated && isSessionValid()) ? 'parent' : 'child';

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const handleTimerUpdate = (newTimeLeft: number, active: boolean) => {
    setTimeLeft(newTimeLeft);
    setIsTimerActive(active);
  };

  if (isLocked) {
    return (
      <DeviceLockScreen 
        timeLeft={timeLeft} 
        onUnlock={handleUnlock}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-orange-50/30">
      <NotificationManager 
        timeLeft={timeLeft}
        isActive={isTimerActive}
        currentMode={effectiveMode}
      />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Shield className="h-8 w-8 text-primary animate-pulse-soft" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TimeGuardian</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Screen Time Control</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge 
                variant={effectiveMode === 'parent' ? 'default' : 'secondary'}
                className="px-3 py-1"
              >
                <Users className="h-3 w-3 mr-1" />
                {effectiveMode === 'parent' ? 'Parent Mode' : 'Child Mode'}
              </Badge>
              
              {isTimerActive && (
                <Badge variant="outline" className="animate-pulse-soft">
                  <Timer className="h-3 w-3 mr-1" />
                  {Math.ceil(timeLeft / 60)}m left
                </Badge>
              )}

              {isLocked && (
                <Badge variant="destructive" className="animate-pulse-soft">
                  <Timer className="h-3 w-3 mr-1" />
                  Device Locked
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Timer</span>
            </TabsTrigger>
            <TabsTrigger value="apps" className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>Apps</span>
            </TabsTrigger>
            <TabsTrigger value="auth" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Authentication</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="animate-slide-in">
            <ParentDashboard currentMode={effectiveMode} />
          </TabsContent>

          <TabsContent value="timer" className="animate-slide-in">
            <TimerControl 
              onLock={setIsLocked} 
              onTimerUpdate={handleTimerUpdate}
            />
          </TabsContent>

          <TabsContent value="apps" className="animate-slide-in">
            <AppManager currentMode={effectiveMode} />
          </TabsContent>

          <TabsContent value="auth" className="animate-slide-in">
            <AuthenticationMode currentMode={effectiveMode} onModeChange={setCurrentMode} />
          </TabsContent>

          <TabsContent value="settings" className="animate-slide-in">
            <UsageAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <SecurityProvider>
      <AppContent />
    </SecurityProvider>
  );
};

export default Index;
