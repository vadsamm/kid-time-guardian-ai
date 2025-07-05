
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Smartphone, Star, Shield, Camera, Music, BookOpen, Gamepad2 } from "lucide-react";

interface AppManagerProps {
  currentMode: 'parent' | 'child';
}

const AppManager = ({ currentMode }: AppManagerProps) => {
  const [allowedApps, setAllowedApps] = useState<string[]>([
    'youtube-kids', 'duolingo', 'khan-academy', 'scratch'
  ]);

  const apps = [
    { id: 'youtube-kids', name: 'YouTube Kids', icon: Star, category: 'Entertainment', safe: true },
    { id: 'duolingo', name: 'Duolingo', icon: BookOpen, category: 'Education', safe: true },
    { id: 'khan-academy', name: 'Khan Academy', icon: BookOpen, category: 'Education', safe: true },
    { id: 'scratch', name: 'Scratch Jr', icon: Gamepad2, category: 'Education', safe: true },
    { id: 'spotify', name: 'Spotify', icon: Music, category: 'Entertainment', safe: false },
    { id: 'instagram', name: 'Instagram', icon: Camera, category: 'Social', safe: false },
    { id: 'tiktok', name: 'TikTok', icon: Camera, category: 'Social', safe: false },
    { id: 'games', name: 'Mobile Games', icon: Gamepad2, category: 'Games', safe: false },
  ];

  const toggleApp = (appId: string) => {
    setAllowedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const safeApps = apps.filter(app => app.safe);
  const restrictedApps = apps.filter(app => !app.safe);

  if (currentMode === 'child') {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Available Apps</span>
            </CardTitle>
            <CardDescription>
              Apps you can use during screen time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {safeApps.filter(app => allowedApps.includes(app.id)).map((app) => {
                const Icon = app.icon;
                return (
                  <Card key={app.id} className="p-4 bg-white/70 hover:bg-white/90 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{app.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {app.category}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <span>App Access Control</span>
          </CardTitle>
          <CardDescription>
            Manage which apps your child can access during screen time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-700">✅ Safe for Kids</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {safeApps.map((app) => {
                  const Icon = app.icon;
                  const isAllowed = allowedApps.includes(app.id);
                  
                  return (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{app.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {app.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <Switch
                        checked={isAllowed}
                        onCheckedChange={() => toggleApp(app.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-700">⚠️ Restricted Apps</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {restrictedApps.map((app) => {
                  const Icon = app.icon;
                  const isAllowed = allowedApps.includes(app.id);
                  
                  return (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Icon className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{app.name}</h4>
                          <Badge variant="destructive" className="text-xs">
                            {app.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <Switch
                        checked={isAllowed}
                        onCheckedChange={() => toggleApp(app.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppManager;
