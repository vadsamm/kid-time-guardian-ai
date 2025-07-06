
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Clock, Smartphone, Users, AlertTriangle, CheckCircle, Activity } from "lucide-react";

interface ParentDashboardProps {
  currentMode: 'parent' | 'child';
  onQuickAction?: (action: string) => void;
}

const ParentDashboard = ({ currentMode, onQuickAction }: ParentDashboardProps) => {
  const todayUsage = 45; // minutes
  const dailyLimit = 60; // minutes
  const usagePercentage = (todayUsage / dailyLimit) * 100;

  const recentActivity = [
    { time: '2:30 PM', action: 'Opened YouTube Kids', duration: '15 min' },
    { time: '1:45 PM', action: 'Completed Duolingo lesson', duration: '12 min' },
    { time: '12:30 PM', action: 'Used Khan Academy', duration: '18 min' },
  ];

  const quickStats = [
    { label: 'Screen Time Today', value: `${todayUsage}/${dailyLimit} min`, icon: Clock, color: 'blue' },
    { label: 'Apps Accessed', value: '4/8 allowed', icon: Smartphone, color: 'green' },
    { label: 'Time Remaining', value: `${dailyLimit - todayUsage} min`, icon: Activity, color: 'orange' },
    { label: 'Mode Status', value: currentMode === 'parent' ? 'Parent' : 'Child', icon: Users, color: 'purple' },
  ];

  const handleQuickAction = (action: string) => {
    if (onQuickAction) {
      onQuickAction(action);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      <Alert className={`${currentMode === 'parent' ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
        <Shield className={`h-4 w-4 ${currentMode === 'parent' ? 'text-green-600' : 'text-orange-600'}`} />
        <AlertDescription>
          Currently in <strong>{currentMode === 'parent' ? 'Parent Mode' : 'Child Mode'}</strong> - 
          {currentMode === 'parent' 
            ? ' Full access to all controls and settings'
            : ' Restricted access with parental controls active'
          }
        </AlertDescription>
      </Alert>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
            green: 'from-green-50 to-green-100 border-green-200 text-green-700',
            orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-700',
            purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700',
          };
          
          return (
            <Card key={index} className={`bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Icon className="h-8 w-8" />
                  <div>
                    <p className="text-sm font-medium opacity-80">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Usage */}
        <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-slate-600" />
              <span>Today's Screen Time</span>
            </CardTitle>
            <CardDescription>
              Current usage against daily limit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: {todayUsage} minutes</span>
                <span>Limit: {dailyLimit} minutes</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <div className="flex justify-center">
                <Badge 
                  variant={usagePercentage > 80 ? "destructive" : usagePercentage > 60 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {Math.round(usagePercentage)}% used
                </Badge>
              </div>
            </div>

            {usagePercentage > 80 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  Approaching daily screen time limit
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest app usage and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.duration}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {currentMode === 'parent' && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Common parental control tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleQuickAction('timer')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Set Timer
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleQuickAction('apps')}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Manage Apps
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleQuickAction('auth')}
              >
                <Users className="h-4 w-4 mr-2" />
                Switch Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParentDashboard;
