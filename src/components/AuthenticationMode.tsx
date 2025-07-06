
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Mic, Users, Key, Brain, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSecurityContext } from "@/contexts/SecurityContext";

interface AuthenticationModeProps {
  currentMode: 'parent' | 'child';
  onModeChange: (mode: 'parent' | 'child') => void;
}

const AuthenticationMode = ({ currentMode, onModeChange }: AuthenticationModeProps) => {
  const [pin, setPin] = useState("");
  const [voiceInput, setVoiceInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { 
    isParentAuthenticated, 
    authenticateParent, 
    logout, 
    isSessionValid,
    isEmergencyMode 
  } = useSecurityContext();

  // Determine effective mode based on actual authentication
  const effectiveMode = (isParentAuthenticated && isSessionValid()) ? 'parent' : 'child';

  const handlePinAuth = () => {
    // Pass the actual PIN to the authentication function
    if (authenticateParent('pin', pin)) {
      onModeChange('parent');
      toast({
        title: "Authentication Successful",
        description: "Switched to Parent Mode",
      });
      setPin("");
    } else {
      toast({
        title: "Authentication Failed",
        description: "Incorrect PIN. Try 1234, 0000, or 9999",
        variant: "destructive",
      });
      setPin("");
    }
  };

  const handleVoiceAuth = () => {
    setIsRecording(true);
    
    // Simulate voice recording and AI processing
    setTimeout(() => {
      setIsRecording(false);
      
      // Pass the voice input to the authentication function
      if (authenticateParent('voice', voiceInput)) {
        onModeChange('parent');
        toast({
          title: "Voice Authentication Successful",
          description: "AI verified parent identity",
        });
        setVoiceInput("");
      } else {
        toast({
          title: "Voice Authentication Failed",
          description: "Could not verify parent identity. Try keywords like 'parent', 'unlock', 'emergency'",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    onModeChange('child');
    toast({
      title: "Logged Out",
      description: "Switched to Child Mode",
    });
  };

  const switchToChildMode = () => {
    // Don't logout, just switch UI mode
    onModeChange('child');
    toast({
      title: "Switched to Child Mode",
      description: "App access is now restricted (parent session still active)",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <span>Current Mode</span>
          </CardTitle>
          <CardDescription>
            Authentication status and mode switching
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="p-6 bg-white/60 rounded-xl">
              <Users className="h-12 w-12 mx-auto mb-3 text-purple-600" />
              <Badge 
                variant={effectiveMode === 'parent' ? 'default' : 'secondary'}
                className="text-lg px-4 py-2"
              >
                {effectiveMode === 'parent' ? 'Parent Mode' : 'Child Mode'}
              </Badge>
              
              {isEmergencyMode && (
                <Badge variant="destructive" className="ml-2">
                  Emergency
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {effectiveMode === 'parent' 
                  ? 'Full access to all features and settings'
                  : 'Limited access to approved apps only'
                }
              </p>
              
              <div className="flex space-x-2">
                {effectiveMode === 'parent' && (
                  <>
                    <Button 
                      onClick={switchToChildMode}
                      variant="outline"
                      className="flex-1"
                    >
                      Switch to Child Mode
                    </Button>
                    <Button 
                      onClick={handleLogout}
                      variant="destructive"
                      size="icon"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Authentication Status */}
          <div className="text-xs text-center space-y-1">
            <p className="text-muted-foreground">
              Authentication Status: {isParentAuthenticated && isSessionValid() ? 'Active' : 'Inactive'}
            </p>
            {isParentAuthenticated && isSessionValid() && (
              <p className="text-green-600">
                ✓ Parent session valid for 30 minutes
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-orange-600" />
            <span>Parent Authentication</span>
          </CardTitle>
          <CardDescription>
            Unlock parent mode using PIN or voice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {effectiveMode === 'child' ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">PIN Authentication</label>
                <div className="flex space-x-2">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    onKeyPress={(e) => e.key === 'Enter' && pin.length === 4 && handlePinAuth()}
                  />
                  <Button onClick={handlePinAuth} disabled={pin.length !== 4}>
                    Unlock
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Try: 1234, 0000, or 9999
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>AI Voice Authentication</span>
                </label>
                <div className="space-y-3">
                  <Input
                    placeholder="Say something like 'I am the parent, unlock the device'"
                    value={voiceInput}
                    onChange={(e) => setVoiceInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && voiceInput && handleVoiceAuth()}
                  />
                  <Button 
                    onClick={handleVoiceAuth}
                    variant="outline"
                    className="w-full"
                    disabled={isRecording || !voiceInput}
                  >
                    <Mic className={`h-4 w-4 mr-2 ${isRecording ? 'animate-pulse text-red-500' : ''}`} />
                    {isRecording ? 'Processing...' : 'Analyze Voice Input'}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  AI will analyze your voice input for parent verification keywords: parent, unlock, emergency, homework
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-green-800 font-medium">Parent Authenticated</p>
                <p className="text-sm text-green-600 mt-1">Full access granted</p>
              </div>
              
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Logout & Switch to Child Mode
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthenticationMode;
