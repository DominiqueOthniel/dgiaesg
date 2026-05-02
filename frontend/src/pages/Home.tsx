import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "@/services/api";
import { useEvents } from "@/hooks/useEvents";
import { useMagazines } from "@/hooks/useMagazines";
import { useNews } from "@/hooks/useNews";
import { getLocalized } from "@/lib/utils";

import { JournalMasthead } from "@/components/home/JournalMasthead";
import { BreakingBar } from "@/components/home/BreakingBar";
import { TopicShortcuts } from "@/components/home/TopicShortcuts";
import {
  HomeFilters,
  applyHomeFilters,
  applyMagazineFilters,
  DEFAULT_HOME_FILTERS,
  type HomeFilterState,
} from "@/components/home/HomeFilters";
import { NewsHomeFront } from "@/components/home/NewsHomeFront";
import { RevuePrincipalHero } from "@/components/home/RevuePrincipalHero";
import { MagazineFeed } from "@/components/home/MagazineFeed";
import { PillarColumns } from "@/components/home/PillarColumns";
import { OpinionPicks } from "@/components/home/OpinionPicks";
import { DataPulse } from "@/components/home/DataPulse";
import { MultimediaSection } from "@/components/home/MultimediaSection";
import { SynergiesSection } from "@/components/home/SynergiesSection";

/**
 * Accueil orienté actualités avec filtres partagés Journal + Revue.
 */
function Home() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const [filters, setFilters] = useState<HomeFilterState>(DEFAULT_HOME_FILTERS);
  const resetFilters = () => setFilters(DEFAULT_HOME_FILTERS);

  const { data: newsData, isLoading: newsLoading } = useNews({
    page: 1,
    limit: 30,
  });
  const { data: events, isLoading: eventsLoading } = useEvents({
    limit: 6,
    featured: true,
  });
  const { data: magazines, isLoading: magazinesLoading } = useMagazines();

  const news = newsData?.data || [];
  const allMagazines = magazines || [];

  const filteredNews = useMemo(
    () => applyHomeFilters(news, filters, lang, getLocalized),
    [news, filters, lang],
  );
  const filteredMagazines = useMemo(
    () => applyMagazineFilters(allMagazines, filters, lang, getLocalized),
    [allMagazines, filters, lang],
  );

  const showJournal = filters.source === "all" || filters.source === "journal";
  const showRevue = filters.source === "all" || filters.source === "revue";

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
      <BreakingBar news={news} lang={lang} />
      <JournalMasthead />
      <TopicShortcuts />

      <HomeFilters
        state={filters}
        onChange={setFilters}
        newsCount={news.length}
        newsFiltered={filteredNews.length}
        revueCount={allMagazines.length}
        revueFiltered={filteredMagazines.length}
      />

      {showJournal && (
        <NewsHomeFront
          news={filteredNews}
          lang={lang}
          isLoading={newsLoading}
          onResetFilters={resetFilters}
        />
      )}

      {showRevue && (
        <>
          <RevuePrincipalHero
            lang={lang}
            magazines={filteredMagazines}
            fallbackMagazines={allMagazines}
            loading={magazinesLoading}
          />
          <MagazineFeed
            magazines={filteredMagazines}
            totalCount={allMagazines.length}
            loading={magazinesLoading}
            lang={lang}
            onResetFilters={resetFilters}
          />
        </>
      )}

      <PillarColumns news={news} lang={lang} />

      <OpinionPicks news={news} lang={lang} />

      <DataPulse />

      <MultimediaSection videoItems={videoItems} podcastItems={podcastItems} />

      <SynergiesSection events={events} eventsLoading={eventsLoading} />
    </div>
  );
}

export default Home;
