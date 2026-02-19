"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/dashboard/components/ui/avatar";
import { Button } from "@/app/dashboard/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/dashboard/components/ui/card";
import { Input } from "@/app/dashboard/components/ui/input";
import { Label } from "@/app/dashboard/components/ui/label";
import { Separator } from "@/app/dashboard/components/ui/separator";
import { Textarea } from "@/app/dashboard/components/ui/textarea";

// Provide a local default user so the route can prerender independently
const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

export default function ProfilePage() {

    return (
        <div className="space-y-6" style={{ padding: 32 }}>
            <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your profile information
                </p>
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Avatar</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-lg">
                            CN
                        </AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Avatar</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            placeholder="Enter your bio"
                            rows={4}
                        />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>
        </div>
    );
}