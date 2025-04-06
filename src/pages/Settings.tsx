
import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your building and account preferences
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Strata Settings</CardTitle>
              <CardDescription>
                Customize your settings for Azure Heights
              </CardDescription>
            </div>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="building">
            <TabsList className="mb-4">
              <TabsTrigger value="building">Building</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="building" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Building Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your building details and information.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="building-name">Building Name</Label>
                    <Input id="building-name" defaultValue="Azure Heights" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="strata-plan">Strata Plan Number</Label>
                    <Input id="strata-plan" defaultValue="SP12345" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="123 Ocean Street" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="suburb">Suburb</Label>
                    <Input id="suburb" defaultValue="Sydney" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" defaultValue="NSW" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input id="postcode" defaultValue="2000" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="w-full sm:w-auto">Save Changes</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your account details and preferences.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" defaultValue="Committee Member" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue="member@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+61 4XX XXX XXX" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lot">Lot Number</Label>
                    <Input id="lot" defaultValue="Lot 10" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="w-full sm:w-auto">Update Profile</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage how you receive notifications and updates.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This feature will be available in a future update.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
