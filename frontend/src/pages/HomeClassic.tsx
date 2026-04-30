import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "@/services/api";
import { useCompanies } from "@/hooks/useCompanies";
import { useEvents } from "@/hooks/useEvents";
import { useMagazines } from "@/hooks/useMagazines";
import { useNews } from "@/hooks/useNews";

import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { EditorialSection } from "@/components/home/EditorialSection";
import { PublicationsSection } from "@/components/home/PublicationsSection";
import { AnnuaireSection } from "@/components/home/AnnuaireSection";
import { MultimediaSection } from "@/components/home/MultimediaSection";
import { ConformiteSection } from "@/components/home/ConformiteSection";
import { SynergiesSection } from "@/components/home/SynergiesSection";

/**
 * Ancienne page d'accueil « portail » (hero plein écran en premier).
 * Conservée pour accès direct route dédiée — voir App.tsx.
 */
function HomeClassic() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const { data: newsData } = useNews({ page: 1, limit: 12 });
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({
    limit: 6,
    status: "certified",
  });
  const { data: events, isLoading: eventsLoading } = useEvents({
    limit: 6,
    featured: true,
  });
  const { data: magazines, isLoading: magazinesLoading } = useMagazines();

  const news = newsData?.data || [];
  const companies = companiesData?.data || [];

  const { data: multimediaData } = useQuery({
    queryKey: ["homepage-multimedia"],
    queryFn: async () => {
      const res = await api.get("/multimedia?limit=12&published=true");
      return res.data.data || [];
    },
  });

  const multimedia = multimediaData || [];
  const videoItems = multimedia.filter((m: any) => m.type === "video");
  const podcastItems = multimedia.filter((m: any) => m.type === "audio");

  return (
    <div className="flex flex-col">
      <HeroSection news={news} lang={lang} />

      <MissionSection
        companies={companies}
        companiesLoading={companiesLoading}
      />

      <EditorialSection news={news} />

      <PublicationsSection
        magazines={magazines}
        magazinesLoading={magazinesLoading}
      />

      <AnnuaireSection
        companies={companies}
        companiesLoading={companiesLoading}
      />

      <MultimediaSection
        videoItems={videoItems}
        podcastItems={podcastItems}
      />

      <ConformiteSection />

      <SynergiesSection events={events} eventsLoading={eventsLoading} />
    </div>
  );
}

export default HomeClassic;
