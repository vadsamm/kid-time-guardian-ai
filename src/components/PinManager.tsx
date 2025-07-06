
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Lock, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSecurityContext } from "@/contexts/SecurityContext";

const PinManager = () => {
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const { toast } = useToast();
  const { 
    setCustomPin, 
    hasCustomPin, 
    getCustomPin, 
    authenticateParent, 
    isParentAuthenticated,
    isSessionValid 
  } = useSecurityContext();

  const handleSetPin = () => {
    if (newPin.length < 4) {
      toast({
        title: "PIN Too Short",
        description: "PIN must be at least 4 digits long",
        variant: "destructive",
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: "PINs Don't Match",
        description: "Please make sure both PINs are identical",
        variant: "destructive",
      });
      return;
    }

    // If there's already a custom PIN, verify current PIN first
    if (hasCustomPin()) {
      if (!authenticateParent('pin', currentPin)) {
        toast({
          title: "Current PIN Incorrect",
          description: "Please enter your current PIN to set a new one",
          variant: "destructive",
        });
        return;
      }
    }

    setCustomPin(newPin);
    setNewPin("");
    setConfirmPin("");
    setCurrentPin("");
    setIsSettingPin(false);
    
    toast({
      title: "PIN Set Successfully",
      description: "Your custom PIN has been saved securely",
    });
  };

  const handleResetToDefault = () => {
    if (hasCustomPin()) {
      if (!authenticateParent('pin', currentPin)) {
        toast({
          title: "Current PIN Incorrect",
          description: "Please enter your current PIN to reset to defaults",
          variant: "destructive",
        });
        return;
      }
    }

    localStorage.removeItem('customParentPin');
    setCurrentPin("");
    setIsSettingPin(false);
    
    toast({
      title: "PIN Reset",
      description: "Restored to default PINs (1234, 0000, 9999)",
    });
  };

  if (!isParentAuthenticated || !isSessionValid()) {
    return (
      <Alert className="border-orange-200 bg-orange-50">
        <Shield className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-700">
          Please authenticate as parent first to manage PIN settings
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-blue-600" />
          <span>PIN Management</span>
        </CardTitle>
        <CardDescription>
          Set up your custom parent authentication PIN
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="p-4 bg-white/60 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Current PIN Status</p>
                <p className="text-sm text-muted-foreground">
                  {hasCustomPin() ? 'Custom PIN active' : 'Using default PINs (1234, 0000, 9999)'}
                </p>
              </div>
            </div>
            <Badge variant={hasCustomPin() ? "default" : "secondary"}>
              {hasCustomPin() ? "Custom" : "Default"}
            </Badge>
          </div>
        </div>

        {!isSettingPin ? (
          <div className="space-y-3">
            <Button 
              onClick={() => setIsSettingPin(true)}
              className="w-full"
            >
              <Key className="h-4 w-4 mr-2" />
              {hasCustomPin() ? 'Change PIN' : 'Set Custom PIN'}
            </Button>
            
            {hasCustomPin() && (
              <Button 
                onClick={() => setIsSettingPin(true)}
                variant="outline"
                className="w-full text-orange-600 border-orange-300"
              >
                Reset to Default PINs
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {hasCustomPin() && (
              <div>
                <label className="text-sm font-medium mb-2 block">Current PIN</label>
                <Input
                  type="password"
                  placeholder="Enter current PIN"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  maxLength={6}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">New PIN</label>
              <Input
                type="password"
                placeholder="Enter new PIN (min 4 digits)"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                maxLength={6}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Confirm New PIN</label>
              <Input
                type="password"
                placeholder="Confirm new PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                maxLength={6}
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleSetPin}
                disabled={!newPin || !confirmPin || (hasCustomPin() && !currentPin)}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Set PIN
              </Button>
              
              <Button 
                onClick={() => {
                  setIsSettingPin(false);
                  setNewPin("");
                  setConfirmPin("");
                  setCurrentPin("");
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>

            {hasCustomPin() && (
              <Button 
                onClick={handleResetToDefault}
                variant="destructive"
                className="w-full"
                disabled={!currentPin}
              >
                Reset to Default PINs
              </Button>
            )}
          </div>
        )}

        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 text-sm">
            Your PIN is stored securely on this device. Make sure to remember it as there's no recovery option except resetting to defaults.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default PinManager;
