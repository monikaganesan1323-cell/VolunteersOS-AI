import { notFound } from "next/navigation";
import {
  Mail, Phone, MapPin, Clock, CalendarCheck2, Award, Download,
  FileText, QrCode, Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { volunteers } from "@/data/volunteers";
import { certificates } from "@/data/misc";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return volunteers.map((v) => ({ id: v.id }));
}

export default function VolunteerPassportPage({ params }: { params: { id: string } }) {
  const volunteer = volunteers.find((v) => v.id === params.id);
  if (!volunteer) notFound();

  const xpForNextLevel = (volunteer.level + 1) * 800;
  const xpProgress = (volunteer.xp / xpForNextLevel) * 100;
  const volunteerCerts = certificates.filter((c) => c.volunteerName === volunteer.name);

  return (
    <div className="space-y-6">
      {/* Passport header */}
      <Card className="overflow-hidden">
        <div className="h-28 bg-roast-gradient" />
        <CardContent className="relative pb-6 pt-0">
          <div className="-mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar name={volunteer.name} size={88} className="ring-4 ring-card" />
              <div>
                <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">
                  {volunteer.name}
                </h1>
                <p className="text-sm text-muted-foreground">{volunteer.organization} · {volunteer.id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <QrCode size={14} /> Volunteer QR
              </Button>
              <Button size="sm">
                <FileText size={14} /> Build Resume
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} /> {volunteer.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone size={14} /> {volunteer.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} /> {volunteer.city}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-espresso-600 dark:text-crema-300">
            <Clock size={16} /> <span className="text-xs font-medium uppercase text-muted-foreground">Hours</span>
          </div>
          <div className="mt-2 font-display text-2xl font-semibold text-ink dark:text-crema-50">{volunteer.hours}h</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-espresso-600 dark:text-crema-300">
            <CalendarCheck2 size={16} /> <span className="text-xs font-medium uppercase text-muted-foreground">Events</span>
          </div>
          <div className="mt-2 font-display text-2xl font-semibold text-ink dark:text-crema-50">{volunteer.eventsAttended}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-espresso-600 dark:text-crema-300">
            <Award size={16} /> <span className="text-xs font-medium uppercase text-muted-foreground">Level</span>
          </div>
          <div className="mt-2 font-display text-2xl font-semibold text-ink dark:text-crema-50">{volunteer.level}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-espresso-600 dark:text-crema-300">
            <Sparkles size={16} /> <span className="text-xs font-medium uppercase text-muted-foreground">XP</span>
          </div>
          <div className="mt-2 font-display text-2xl font-semibold text-ink dark:text-crema-50">{volunteer.xp.toLocaleString("en-IN")}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Level Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Level {volunteer.level}</span>
              <span className="text-muted-foreground">{volunteer.xp} / {xpForNextLevel} XP</span>
            </div>
            <Progress value={xpProgress} />

            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold text-foreground">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {volunteer.skills.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h4 className="mb-3 text-sm font-semibold text-foreground">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {volunteer.interests.map((s) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badges &amp; Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {volunteer.badges.length === 0 && (
              <p className="text-sm text-muted-foreground">No badges earned yet.</p>
            )}
            {volunteer.badges.map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-crema-swirl text-espresso-800">
                  <Award size={16} />
                </div>
                <span className="text-sm font-medium text-foreground">{b}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Certificates</CardTitle>
          <Badge variant="secondary">{volunteerCerts.length} issued</Badge>
        </CardHeader>
        <CardContent>
          {volunteerCerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No certificates issued yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {volunteerCerts.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">{c.eventTitle}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(c.issuedOn)} · {c.hours}h</div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download size={15} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
