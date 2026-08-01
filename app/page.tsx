import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { ActivityTicker } from "@/components/marketing/activity-ticker";
import { QuickAccess } from "@/components/marketing/quick-access";
import { LiveStats } from "@/components/marketing/live-stats";
import { AIRecommendations } from "@/components/marketing/ai-recommendations";
import { FeaturedVolunteers } from "@/components/marketing/featured-volunteers";
import { FeaturedOrganizations } from "@/components/marketing/featured-organizations";
import { EventsFeed } from "@/components/marketing/events-feed";
import { EventApplications } from "@/components/marketing/event-applications";
import { VolunteerPassport } from "@/components/marketing/volunteer-passport";
import { ImpactCalculator } from "@/components/marketing/impact-calculator";
import { Sponsors } from "@/components/marketing/sponsors";
import { SocialImpact } from "@/components/marketing/social-impact";
import { Features } from "@/components/marketing/features";
import { Testimonials } from "@/components/marketing/testimonials";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";
import { AIAssistantWidget } from "@/components/marketing/ai-assistant-widget";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-parchment dark:bg-bark">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <ActivityTicker />
      <QuickAccess />
      <LiveStats />
      <AIRecommendations />
      <FeaturedVolunteers />
      <FeaturedOrganizations />
      <EventsFeed />
      <EventApplications />
      <VolunteerPassport />
      <ImpactCalculator />
      <Sponsors />
      <SocialImpact />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
      <AIAssistantWidget />
    </main>
  );
}
