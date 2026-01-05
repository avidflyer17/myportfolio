import { HeroSection } from "@/components/sections/hero";
import { ExperienceSection } from "@/components/sections/experience";
import { ArchitectureSection } from "@/components/sections/architecture";
import { ContactSection } from "@/components/sections/contact";
import { ProjectsSection } from "@/components/sections/projects";
import { StarBackground } from "@/components/ui/star-background";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-neon-pink selection:text-white relative">
      <StarBackground />
      <div className="relative z-10">
        <HeroSection />
        <ProjectsSection />
        <ArchitectureSection />
        <ExperienceSection />
        <ContactSection />
      </div>
    </main>
  );
}
