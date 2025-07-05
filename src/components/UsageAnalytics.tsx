
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, Smartphone, TrendingUp } from "lucide-react";

const UsageAnalytics = () => {
  const weeklyData = [
    { day: 'Mon', screenTime: 45, allowed: 60 },
    { day: 'Tue', screenTime: 38, allowed: 60 },
    { day: 'Wed', screenTime: 52, allowed: 60 },
    { day: 'Thu', screenTime: 35, allowed: 60 },
    { day: 'Fri', screenTime: 48, allowed: 60 },
    { day: 'Sat', screenTime: 65, allowed: 90 },
    { day: 'Sun', screenTime: 58, allowed: 90 },
  ];

  const appUsageData = [
    { name: 'YouTube Kids', value: 35, color: '#FF6B6B' },
    { name: 'Duolingo', value: 25, color: '#4ECDC4' },
    { name: 'Khan Academy', value: 20, color: '#45B7D1' },
    { name: 'Scratch Jr', value: 15, color: '#FFA726' },
    { name: 'Other', value: 5, color: '#AB47BC' },
  ];

  const totalScreenTime = weeklyData.reduce((sum, day) => sum + day.screenTime, 0);
  const averageDaily = Math.round(totalScreenTime / 7);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Total This Week</p>
                <p className="text-2xl font-bold text-blue-800">{totalScreenTime}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Daily Average</p>
                <p className="text-2xl font-bold text-green-800">{averageDaily}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Smartphone className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700">Apps Used</p>
                <p className="text-2xl font-bold text-orange-800">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Compliance</p>
                <p className="text-2xl font-bold text-purple-800">92%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-slate-600" />
              <span>Weekly Screen Time</span>
            </CardTitle>
            <CardDescription>
              Daily usage vs allowed time limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="screenTime" fill="#3B82F6" name="Used (min)" />
                <Bar dataKey="allowed" fill="#E5E7EB" name="Allowed (min)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-indigo-600" />
              <span>App Usage Distribution</span>
            </CardTitle>
            <CardDescription>
              Time spent in different applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={appUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {appUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2 flex-1">
                {appUsageData.map((app, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: app.color }}
                      />
                      <span className="text-sm">{app.name}</span>
                    </div>
                    <Badge variant="secondary">{app.value}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsageAnalytics;
