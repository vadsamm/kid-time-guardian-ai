
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Shield, AlertTriangle, Phone, Clock, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSecurityContext } from '@/contexts/SecurityContext';

interface DeviceLockScreenProps {
  timeLeft: number;
  onUnlock: () => void;
}

const DeviceLockScreen = ({ timeLeft, onUnlock }: DeviceLockScreenProps) => {
  const [pin, setPin] = useState('');
  const [emergencyCode, setEmergencyCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(0);
  const { toast } = useToast();
  const { authenticateParent, emergencyUnlock, isEmergencyMode } = useSecurityContext();

  const MAX_ATTEMPTS = 3;
  const BLOCK_DURATION = 5 * 60; // 5 minutes

  useEffect(() => {
    // Block navigation and prevent back button
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'F11' || (e.ctrlKey && e.key === 'w')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Device is locked. Are you sure you want to leave?';
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (isBlocked && blockTime > 0) {
      const timer = setInterval(() => {
        setBlockTime(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBlocked, blockTime]);

  const handlePinSubmit = () => {
    if (isBlocked) {
      toast({
        title: "Too Many Attempts",
        description: `Please wait ${Math.ceil(blockTime / 60)} more minutes`,
        variant: "destructive",
      });
      return;
    }

    if (pin === '1234' || pin === '0000') {
      if (authenticateParent('pin')) {
        onUnlock();
        toast({
          title: "Device Unlocked",
          description: "Parent authentication successful",
        });
      }
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        setBlockTime(BLOCK_DURATION);
        toast({
          title: "Too Many Failed Attempts",
          description: "Device blocked for 5 minutes",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Incorrect PIN",
          description: `${MAX_ATTEMPTS - newAttempts} attempts remaining`,
          variant: "destructive",
        });
      }
    }
    setPin('');
  };

  const handleEmergencyUnlock = () => {
    if (emergencyCode === 'EMERGENCY123') {
      emergencyUnlock();
      onUnlock();
      toast({
        title: "Emergency Unlock",
        description: "Emergency access granted for 10 minutes",
        variant: "default",
      });
    } else {
      toast({
        title: "Invalid Emergency Code",
        description: "Please contact your parent or guardian",
        variant: "destructive",
      });
    }
    setEmergencyCode('');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-900 via-red-800 to-orange-900 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative max-w-md w-full mx-4 space-y-6">
        {/* Main Lock Screen */}
        <Card className="bg-white/95 backdrop-blur-md border-red-300 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <Smartphone className="h-10 w-10 text-red-600 animate-pulse" />
            </div>
            <CardTitle className="text-2xl text-red-800">Device Locked</CardTitle>
            <div className="text-6xl font-mono font-bold text-red-600 my-4">
              {formatTime(timeLeft)}
            </div>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Screen Time Exceeded
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isEmergencyMode && (
              <Alert className="border-orange-300 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Emergency mode active - Limited access granted
                </AlertDescription>
              </Alert>
            )}

            {/* PIN Unlock */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Parent PIN</span>
              </label>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  disabled={isBlocked}
                  className="text-lg text-center"
                />
                <Button 
                  onClick={handlePinSubmit} 
                  disabled={pin.length !== 4 || isBlocked}
                  className="px-6"
                >
                  Unlock
                </Button>
              </div>
              
              {isBlocked && (
                <p className="text-sm text-red-600 text-center">
                  Blocked for {Math.ceil(blockTime / 60)} minutes ({attempts}/{MAX_ATTEMPTS} attempts)
                </p>
              )}
            </div>

            {/* Emergency Access */}
            <div className="border-t pt-4 space-y-3">
              <label className="text-sm font-medium flex items-center space-x-2 text-orange-700">
                <Phone className="h-4 w-4" />
                <span>Emergency Access</span>
              </label>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  placeholder="Emergency Code"
                  value={emergencyCode}
                  onChange={(e) => setEmergencyCode(e.target.value)}
                  className="text-sm"
                />
                <Button 
                  onClick={handleEmergencyUnlock}
                  variant="outline"
                  className="text-orange-600 border-orange-300"
                >
                  Emergency
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                For emergencies only. Contact parent/guardian if needed.
              </p>
            </div>

            {/* Information */}
            <Alert className="border-blue-300 bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                Device will automatically unlock when timer expires. 
                Ask a parent to unlock early if needed.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeviceLockScreen;
