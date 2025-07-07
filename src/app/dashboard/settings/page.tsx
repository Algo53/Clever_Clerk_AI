'use client'

import { useState } from "react"
import { Upload, User2Icon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userStore } from "@/store/userStore"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  const { user } = userStore();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.image ? user.image : null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result is a base64 data URI
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    console.log("Saving profile:", { name, avatarUrl });
    // In a real app, you would save this to the backend, sending the base64 string.
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information and avatar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="flex sm:flex-row flex-col items-center gap-6">
              <Avatar className="h-20 w-20" data-ai-hint="person face">
                {
                  avatarUrl ? (
                    <>
                      <AvatarImage src={`data:image/jpeg;base64,${avatarUrl}`} alt="User avatar" />
                      <AvatarFallback>{user?.name}</AvatarFallback>
                    </>
                  ) : (
                    <div className="flex w-full h-full justify-center items-center">
                      <User2Icon className="h-8 w-8" />
                    </div>
                  )
                }
              </Avatar>
              <div className="flex-1 space-y-2 space-x-4 items-center w-min whitespace-nowrap">
                <Label>Avatar</Label>
                <Input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                <Button asChild variant="outline">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Label>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Choose a new avatar from your device.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={user?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Username</Label>
              <Input id="name" name="name" value={user?.username} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email} disabled />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card >

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

    </div >
  )
}
