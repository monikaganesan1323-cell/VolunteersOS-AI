"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import {
  User, Palette, Lock, Bell, ShieldCheck, Building2, KeyRound, Copy, Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tabs = [
  { value: "profile", label: "Profile", icon: User },
  { value: "theme", label: "Theme", icon: Palette },
  { value: "password", label: "Password", icon: Lock },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "security", label: "Security", icon: ShieldCheck },
  { value: "organization", label: "Organization", icon: Building2 },
  { value: "api", label: "API Keys", icon: KeyRound },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account, organization, and preferences.</p>
      </div>

      <Tabs.Root defaultValue="profile" orientation="vertical" className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <Tabs.List className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {tabs.map((t) => (
            <Tabs.Trigger
              key={t.value}
              value={t.value}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors",
                "data-[state=active]:bg-espresso-600 data-[state=active]:text-crema-50"
              )}
            >
              <t.icon size={16} /> {t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div>
          <Tabs.Content value="profile">
            <Card>
              <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar name="Monika Varghese" size={64} />
                  <Button variant="outline" size="sm">Change photo</Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Full name</Label>
                    <Input defaultValue="Monika Varghese" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Role</Label>
                    <Input defaultValue="Program Admin" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Email</Label>
                    <Input defaultValue="monika@rotaractkochi.org" />
                  </div>
                </div>
                <Button onClick={() => toast.success("Profile updated")}>Save changes</Button>
              </CardContent>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="theme">
            <Card>
              <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:w-80">
                  {(["light", "dark"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "rounded-2xl border-2 p-4 text-left capitalize transition-colors",
                        theme === t ? "border-espresso-600" : "border-border"
                      )}
                    >
                      <div className={cn("mb-3 h-12 w-full rounded-lg", t === "light" ? "bg-parchment border border-espresso-100" : "bg-bark")} />
                      <span className="text-sm font-medium text-foreground">{t}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="password">
            <Card>
              <CardHeader><CardTitle>Password</CardTitle></CardHeader>
              <CardContent className="max-w-sm space-y-4">
                <div className="space-y-1.5"><Label>Current password</Label><Input type="password" /></div>
                <div className="space-y-1.5"><Label>New password</Label><Input type="password" /></div>
                <div className="space-y-1.5"><Label>Confirm new password</Label><Input type="password" /></div>
                <Button onClick={() => toast.success("Password updated")}>Update password</Button>
              </CardContent>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="notifications">
            <Card>
              <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {["Event reminders", "Emergency broadcasts", "Certificate updates", "Leaderboard changes", "Weekly digest"].map((n) => (
                  <label key={n} className="flex items-center justify-between rounded-xl border border-border p-3.5">
                    <span className="text-sm text-foreground">{n}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-espresso-600" />
                  </label>
                ))}
              </CardContent>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="security">
            <Card>
              <CardHeader><CardTitle>Security</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center justify-between rounded-xl border border-border p-3.5">
                  <div>
                    <div className="text-sm font-medium text-foreground">Two-factor authentication</div>
                    <div className="text-xs text-muted-foreground">Add an extra layer of security to your account.</div>
                  </div>
                  <input type="checkbox" className="h-4 w-4 rounded accent-espresso-600" />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-border p-3.5">
                  <div>
                    <div className="text-sm font-medium text-foreground">Login alerts</div>
                    <div className="text-xs text-muted-foreground">Get notified about new sign-ins to your account.</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-espresso-600" />
                </label>
              </CardContent>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="organization">
            <Card>
              <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div className="space-y-1.5"><Label>Organization name</Label><Input defaultValue="Rotaract Kochi" /></div>
                <div className="space-y-1.5"><Label>Registration ID</Label><Input defaultValue="RC-KOC-2019-042" /></div>
                <div className="space-y-1.5"><Label>Region</Label><Input defaultValue="Ernakulam, Kerala" /></div>
                <Button onClick={() => toast.success("Organization details saved")}>Save changes</Button>
              </CardContent>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="api">
            <Card>
              <CardHeader><CardTitle>API Keys</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">Production key</div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">
                      {apiKeyVisible ? "vos_live_9f2a1c8e7b3d4f6a0c1e2b3d4f5a6c7e" : "vos_live_••••••••••••••••••••••••"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="success">Active</Badge>
                    <Button variant="ghost" size="icon" onClick={() => setApiKeyVisible((v) => !v)}>
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
                <Button variant="outline"><Plus size={15} /> Generate new key</Button>
              </CardContent>
            </Card>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
