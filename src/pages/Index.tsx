
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

const Index = () => {
  const [currentMode, setCurrentMode] = useState<'parent' | 'child'>('parent');
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-orange-50/30">
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
                variant={currentMode === 'parent' ? 'default' : 'secondary'}
                className="px-3 py-1"
              >
                <Users className="h-3 w-3 mr-1" />
                {currentMode === 'parent' ? 'Parent Mode' : 'Child Mode'}
              </Badge>
              
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
        {isLocked ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="p-8 text-center max-w-md mx-auto bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <div className="animate-float mb-6">
                <Smartphone className="h-16 w-16 text-red-500 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-red-700 mb-4">Device Locked</h2>
              <p className="text-red-600 mb-6">Screen time limit reached. Please wait or ask a parent to unlock.</p>
              <Button 
                onClick={() => setCurrentMode('parent')} 
                variant="outline" 
                className="w-full"
              >
                <Mic className="h-4 w-4 mr-2" />
                Parent Unlock (Voice)
              </Button>
            </Card>
          </div>
        ) : (
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
              <ParentDashboard currentMode={currentMode} />
            </TabsContent>

            <TabsContent value="timer" className="animate-slide-in">
              <TimerControl onLock={setIsLocked} />
            </TabsContent>

            <TabsContent value="apps" className="animate-slide-in">
              <AppManager currentMode={currentMode} />
            </TabsContent>

            <TabsContent value="auth" className="animate-slide-in">
              <AuthenticationMode currentMode={currentMode} onModeChange={setCurrentMode} />
            </TabsContent>

            <TabsContent value="settings" className="animate-slide-in">
              <UsageAnalytics />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
