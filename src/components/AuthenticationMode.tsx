
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Mic, Users, Key, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthenticationModeProps {
  currentMode: 'parent' | 'child';
  onModeChange: (mode: 'parent' | 'child') => void;
}

const AuthenticationMode = ({ currentMode, onModeChange }: AuthenticationModeProps) => {
  const [pin, setPin] = useState("");
  const [voiceInput, setVoiceInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handlePinAuth = () => {
    if (pin === "1234") {
      onModeChange('parent');
      toast({
        title: "Authentication Successful",
        description: "Switched to Parent Mode",
      });
      setPin("");
    } else {
      toast({
        title: "Authentication Failed",
        description: "Incorrect PIN",
        variant: "destructive",
      });
    }
  };

  const handleVoiceAuth = () => {
    setIsRecording(true);
    
    // Simulate voice recording and AI processing
    setTimeout(() => {
      setIsRecording(false);
      
      // Simulate AI analysis
      const keywords = ['parent', 'unlock', 'emergency', 'homework'];
      const hasValidKeyword = keywords.some(keyword => 
        voiceInput.toLowerCase().includes(keyword)
      );
      
      if (hasValidKeyword) {
        onModeChange('parent');
        toast({
          title: "Voice Authentication Successful",
          description: "AI verified parent identity",
        });
        setVoiceInput("");
      } else {
        toast({
          title: "Voice Authentication Failed",
          description: "Could not verify parent identity",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const switchToChildMode = () => {
    onModeChange('child');
    toast({
      title: "Switched to Child Mode",
      description: "App access is now restricted",
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
                variant={currentMode === 'parent' ? 'default' : 'secondary'}
                className="text-lg px-4 py-2"
              >
                {currentMode === 'parent' ? 'Parent Mode' : 'Child Mode'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {currentMode === 'parent' 
                  ? 'Full access to all features and settings'
                  : 'Limited access to approved apps only'
                }
              </p>
              
              {currentMode === 'parent' && (
                <Button 
                  onClick={switchToChildMode}
                  variant="outline"
                  className="w-full"
                >
                  Switch to Child Mode
                </Button>
              )}
            </div>
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
                />
                <Button onClick={handlePinAuth} disabled={pin.length !== 4}>
                  Unlock
                </Button>
              </div>
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
                AI will analyze your voice input for parent verification keywords
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthenticationMode;
