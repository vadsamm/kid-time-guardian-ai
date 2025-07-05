
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Pause, Square, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimerControlProps {
  onLock: (locked: boolean) => void;
}

const TimerControl = ({ onLock }: TimerControlProps) => {
  const [duration, setDuration] = useState([30]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            onLock(true);
            toast({
              title: "Time's Up!",
              description: "Screen time limit reached. Device is now locked.",
              variant: "destructive",
            });
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isActive) {
      onLock(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft, onLock, toast]);

  const startTimer = () => {
    setTimeLeft(duration[0] * 60);
    setIsActive(true);
    setIsPaused(false);
    toast({
      title: "Timer Started",
      description: `Screen time set for ${duration[0]} minutes`,
    });
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    onLock(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Timer className="h-5 w-5 text-blue-600" />
            <span>Set Screen Time</span>
          </CardTitle>
          <CardDescription>
            Set how long the device can be used before it locks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Duration</span>
              <Badge variant="secondary">{duration[0]} minutes</Badge>
            </div>
            
            <Slider
              value={duration}
              onValueChange={setDuration}
              max={180}
              min={5}
              step={5}
              className="w-full"
              disabled={isActive}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 min</span>
              <span>90 min</span>
              <span>3 hours</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={startTimer}
              disabled={isActive}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
            
            {isActive && (
              <>
                <Button 
                  onClick={pauseTimer}
                  variant="outline"
                  size="icon"
                >
                  <Pause className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={stopTimer}
                  variant="destructive"
                  size="icon"
                >
                  <Square className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <span>Current Timer</span>
          </CardTitle>
          <CardDescription>
            Active screen time monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold text-orange-600 animate-pulse-soft">
              {formatTime(timeLeft)}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                {isActive ? (
                  <Badge variant="default" className="bg-green-500">
                    <Play className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Pause className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
                
                {isPaused && (
                  <Badge variant="outline" className="text-orange-600">
                    Paused
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {isActive 
                  ? `${Math.round((timeLeft / (duration[0] * 60)) * 100)}% remaining`
                  : 'Set a timer to begin monitoring'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimerControl;
