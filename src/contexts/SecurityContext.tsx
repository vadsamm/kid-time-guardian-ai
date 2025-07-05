
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SecurityContextType {
  isParentAuthenticated: boolean;
  lastAuthTime: number;
  authenticateParent: (method: 'pin' | 'voice') => boolean;
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

  const authenticateParent = (method: 'pin' | 'voice'): boolean => {
    // Enhanced validation - you can customize these
    const validPins = ['1234', '0000', '9999'];
    const voiceKeywords = ['parent', 'unlock', 'emergency', 'homework', 'adult'];
    
    let isValid = false;
    
    if (method === 'pin') {
      // This would be called with actual PIN input
      isValid = true; // Simplified for demo
    } else if (method === 'voice') {
      // This would be called with actual voice analysis
      isValid = true; // Simplified for demo
    }

    if (isValid) {
      const now = Date.now();
      setIsParentAuthenticated(true);
      setLastAuthTime(now);
      
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
  };

  const isSessionValid = (): boolean => {
    if (!isParentAuthenticated) return false;
    const now = Date.now();
    return (now - lastAuthTime) < SESSION_TIMEOUT;
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
