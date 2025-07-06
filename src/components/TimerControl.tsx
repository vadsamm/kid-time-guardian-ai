
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Play, Pause, Square, Timer, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSecurityContext } from "@/contexts/SecurityContext";

interface TimerControlProps {
  onLock: (locked: boolean) => void;
  onTimerUpdate: (timeLeft: number, active: boolean) => void;
}

const TimerControl = ({ onLock, onTimerUpdate }: TimerControlProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState("");
  const { toast } = useToast();
  const { isParentAuthenticated, isSessionValid } = useSecurityContext();

  // Determine if user has parent access
  const hasParentAccess = isParentAuthenticated && isSessionValid();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          const newTime = time - 1;
          onTimerUpdate(newTime, true);
          
          if (newTime === 0) {
            setIsActive(false);
            onLock(true);
            toast({
              title: "Time's Up!",
              description: "Screen time limit reached. Device will now be locked.",
              variant: "destructive",
            });
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else if (!isActive) {
      onTimerUpdate(timeLeft, false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onLock, onTimerUpdate, toast]);

  const startTimer = () => {
    const minutes = parseInt(inputMinutes);
    if (minutes > 0) {
      setTimeLeft(minutes * 60);
      setIsActive(true);
      toast({
        title: "Timer Started",
        description: `Screen time set for ${minutes} minutes`,
      });
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
    toast({
      title: "Timer Paused",
      description: "Screen time timer has been paused",
    });
  };

  const resumeTimer = () => {
    if (timeLeft > 0) {
      setIsActive(true);
      toast({
        title: "Timer Resumed",
        description: "Screen time timer has been resumed",
      });
    }
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    onTimerUpdate(0, false);
    toast({
      title: "Timer Stopped",
      description: "Screen time timer has been reset",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Child view - restricted access
  if (!hasParentAccess) {
    return (
      <div className="space-y-6">
        <Alert className="border-orange-200 bg-orange-50">
          <Shield className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            Only parents can set screen time limits. Ask a parent to set your timer.
          </AlertDescription>
        </Alert>

        {/* Show current timer status only */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Timer className="h-5 w-5 text-blue-600" />
              <span>Current Screen Time</span>
            </CardTitle>
            <CardDescription>
              Your current screen time session
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold text-blue-600">
              {formatTime(timeLeft)}
            </div>
            <Badge 
              variant={isActive ? "default" : "secondary"}
              className="text-lg px-4 py-2"
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
            {isActive && timeLeft > 0 && (
              <p className="text-sm text-muted-foreground">
                Time remaining in your current session
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parent view - full access
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Screen Time Timer</span>
          </CardTitle>
          <CardDescription>
            Set and manage screen time limits for your child
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold text-blue-600">
              {formatTime(timeLeft)}
            </div>
            <Badge 
              variant={isActive ? "default" : "secondary"}
              className="text-lg px-4 py-2"
            >
              {isActive ? "Running" : "Stopped"}
            </Badge>
          </div>

          {/* Timer Input */}
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Minutes"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              min="1"
              max="480"
              disabled={isActive}
              className="flex-1"
            />
            <Button 
              onClick={startTimer} 
              disabled={isActive || !inputMinutes || parseInt(inputMinutes) <= 0}
              className="px-6"
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          </div>

          {/* Timer Controls */}
          <div className="flex space-x-2 justify-center">
            <Button
              onClick={isActive ? pauseTimer : resumeTimer}
              disabled={timeLeft === 0}
              variant="outline"
              size="sm"
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              )}
            </Button>
            
            <Button
              onClick={stopTimer}
              disabled={timeLeft === 0}
              variant="outline"
              size="sm"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>

          {/* Quick Timer Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 60, 120].map((minutes) => (
              <Button
                key={minutes}
                onClick={() => {
                  setInputMinutes(minutes.toString());
                  setTimeLeft(minutes * 60);
                  setIsActive(true);
                  toast({
                    title: "Quick Timer Set",
                    description: `Screen time set for ${minutes} minutes`,
                  });
                }}
                disabled={isActive}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {minutes}m
              </Button>
            ))}
          </div>

          {isActive && timeLeft > 0 && (
            <Alert className="border-green-200 bg-green-50">
              <Timer className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Timer is running. Device will lock automatically when time expires.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimerControl;
