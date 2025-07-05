
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationManagerProps {
  timeLeft: number;
  isActive: boolean;
  currentMode: 'parent' | 'child';
}

const NotificationManager = ({ timeLeft, isActive, currentMode }: NotificationManagerProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isActive) return;

    const checkTimeWarnings = () => {
      const warnings = [];
      
      // 10 minutes warning
      if (timeLeft === 600) {
        warnings.push({
          id: 'warning-10min',
          type: 'warning' as const,
          title: '10 Minutes Remaining',
          message: 'Please start finishing up your current activity.',
          timestamp: Date.now(),
          persistent: true
        });
      }
      
      // 5 minutes warning
      if (timeLeft === 300) {
        warnings.push({
          id: 'warning-5min',
          type: 'warning' as const,
          title: '5 Minutes Remaining',
          message: 'Time to wrap up and prepare to put the device away.',
          timestamp: Date.now(),
          persistent: true
        });
      }
      
      // 2 minutes warning
      if (timeLeft === 120) {
        warnings.push({
          id: 'warning-2min',
          type: 'error' as const,
          title: '2 Minutes Left!',
          message: 'Device will lock soon. Save your progress.',
          timestamp: Date.now(),
          persistent: true
        });
      }
      
      // 30 seconds warning
      if (timeLeft === 30) {
        warnings.push({
          id: 'warning-30sec',
          type: 'error' as const,
          title: '30 Seconds!',
          message: 'Device locking in 30 seconds.',
          timestamp: Date.now(),
          persistent: true
        });
      }

      warnings.forEach(warning => {
        setNotifications(prev => {
          if (prev.find(n => n.id === warning.id)) return prev;
          return [...prev, warning];
        });
        
        toast({
          title: warning.title,
          description: warning.message,
          variant: warning.type === 'error' ? 'destructive' : 'default',
        });
      });
    };

    checkTimeWarnings();
  }, [timeLeft, isActive, toast]);

  // Hourly usage reminder
  useEffect(() => {
    if (currentMode === 'child' && isActive) {
      const interval = setInterval(() => {
        const usageMinutes = Math.floor((Date.now() - Date.now()) / 60000); // Simplified
        
        if (usageMinutes > 0 && usageMinutes % 30 === 0) {
          const notification: Notification = {
            id: `usage-${Date.now()}`,
            type: 'info',
            title: 'Screen Time Check',
            message: `You've been using the device for ${usageMinutes} minutes.`,
            timestamp: Date.now(),
            action: {
              label: 'Take Break',
              onClick: () => {
                toast({
                  title: 'Good Choice!',
                  description: 'Taking breaks helps your eyes and brain.',
                });
              }
            }
          };
          
          setNotifications(prev => [...prev, notification]);
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [currentMode, isActive, toast]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      case 'success': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-orange-300 bg-orange-50';
      case 'error': return 'border-red-300 bg-red-50';
      case 'info': return 'border-blue-300 bg-blue-50';
      case 'success': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 space-y-2 max-w-sm">
      {notifications.slice(0, 3).map((notification) => (
        <Alert key={notification.id} className={`${getNotificationColor(notification.type)} shadow-lg`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                {notification.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 h-6 text-xs"
                    onClick={notification.action.onClick}
                  >
                    {notification.action.label}
                  </Button>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => removeNotification(notification.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Alert>
      ))}
      
      {notifications.length > 3 && (
        <Badge variant="secondary" className="ml-6">
          +{notifications.length - 3} more
        </Badge>
      )}
    </div>
  );
};

export default NotificationManager;
