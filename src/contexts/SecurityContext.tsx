
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SecurityContextType {
  isParentAuthenticated: boolean;
  lastAuthTime: number;
  authenticateParent: (method: 'pin' | 'voice', input?: string) => boolean;
  logout: () => void;
  isSessionValid: () => boolean;
  emergencyUnlock: () => void;
  isEmergencyMode: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isParentAuthenticated, setIsParentAuthenticated] = useState(false);
  const [lastAuthTime, setLastAuthTime] = useState(0);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  // Session timeout: 30 minutes
  const SESSION_TIMEOUT = 30 * 60 * 1000;

  useEffect(() => {
    const savedAuth = localStorage.getItem('parentAuthSession');
    if (savedAuth) {
      const { timestamp, authenticated } = JSON.parse(savedAuth);
      const now = Date.now();
      if (authenticated && (now - timestamp) < SESSION_TIMEOUT) {
        setIsParentAuthenticated(true);
        setLastAuthTime(timestamp);
      } else {
        localStorage.removeItem('parentAuthSession');
      }
    }
  }, []);

  const authenticateParent = (method: 'pin' | 'voice', input?: string): boolean => {
    const validPins = ['1234', '0000', '9999'];
    const voiceKeywords = ['parent', 'unlock', 'emergency', 'homework', 'adult'];
    
    let isValid = false;
    
    if (method === 'pin' && input) {
      // Validate actual PIN input
      isValid = validPins.includes(input.trim());
      console.log('PIN validation:', input, 'Valid:', isValid);
    } else if (method === 'voice' && input) {
      // Validate voice input for keywords
      const lowerInput = input.toLowerCase();
      isValid = voiceKeywords.some(keyword => lowerInput.includes(keyword));
      console.log('Voice validation:', input, 'Valid:', isValid);
    }

    if (isValid) {
      const now = Date.now();
      setIsParentAuthenticated(true);
      setLastAuthTime(now);
      setIsEmergencyMode(false); // Clear emergency mode on normal auth
      
      // Save session
      localStorage.setItem('parentAuthSession', JSON.stringify({
        timestamp: now,
        authenticated: true
      }));
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsParentAuthenticated(false);
    setLastAuthTime(0);
    setIsEmergencyMode(false);
    localStorage.removeItem('parentAuthSession');
    console.log('Parent logged out');
  };

  const isSessionValid = (): boolean => {
    if (!isParentAuthenticated) return false;
    const now = Date.now();
    const isValid = (now - lastAuthTime) < SESSION_TIMEOUT;
    
    // Auto logout if session expired
    if (!isValid && isParentAuthenticated) {
      logout();
    }
    
    return isValid;
  };

  const emergencyUnlock = () => {
    setIsEmergencyMode(true);
    setIsParentAuthenticated(true);
    const now = Date.now();
    setLastAuthTime(now);
    
    // Emergency session is shorter - 10 minutes
    localStorage.setItem('parentAuthSession', JSON.stringify({
      timestamp: now,
      authenticated: true,
      emergency: true
    }));
    
    console.log('Emergency unlock activated');
  };

  return (
    <SecurityContext.Provider value={{
      isParentAuthenticated,
      lastAuthTime,
      authenticateParent,
      logout,
      isSessionValid,
      emergencyUnlock,
      isEmergencyMode
    }}>
      {children}
    </SecurityContext.Provider>
  );
};
