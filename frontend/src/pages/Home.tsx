import {
  Award,
  ArrowRight,
  ShieldCheck,
  Globe,
  TrendingUp,
  Newspaper,
  CheckCircle2,
  Users,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { useLabels } from "../hooks/useLabels";
import { useNews } from "../hooks/useNews";
import { cn } from "../lib/utils";
import { resolveImageUrl } from "../lib/image";
import { useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

function Home() {
  const { data: labels, isLoading: labelsLoading } = useLabels();
  const { data: newsData, isLoading: newsLoading } = useNews({ page: 1, limit: 4 });
  const news = newsData?.data || [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "/img/hero_image.jpg",
      title: "Cooperative excellence at the service of certified cooperation.",
      description: "Identify, analyze, and validate the performance of your structures through the first global certification registry dedicated to committed cooperatives.",
      tag: "Cooperative Excellence"
    },
    {
      image: "/img/hero_image2.jpg",
      title: "The benchmark for sustainable and social impact.",
      description: "Access a transparent verified network of cooperatives driving socio-economic growth across territories.",
      tag: "Verified Network"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const queryClient = useQueryClient();

  const prefetchArticle = (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ["news", "slug", slug],
      queryFn: async () => {
        const response = await api.get(`/news/slug/${slug}`);
        return response.data.data;
      },
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    <div className="flex flex-col">
      {/* Premium Hero Carousel */}
      <section className="relative h-[600px] md:h-[800px] w-full overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Background Image with Cover */}
            <div
              className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-transform duration-[10s] scale-110 animate-slow-zoom"
              style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            />
            {/* Consistent Overlay (Dark 50%) */}
            <div className="absolute inset-0 bg-slate-900/50" />

            <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/20 backdrop-blur-md text-white border border-white/10 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> {slides[currentSlide].tag}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                >
                  {slides[currentSlide].title.split('service de la').length > 1 ? (
                    <>
                      {slides[currentSlide].title.split('service de la')[0]} service de la <br />
                      <span className="text-brand-accent italic">{slides[currentSlide].title.split('service de la')[1]}</span>
                    </>
                  ) : slides[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl mb-10"
                >
                  {slides[currentSlide].description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center gap-4"
                >
                  <Link to="/directory" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto rounded-full px-8 shadow-2xl shadow-brand-primary/20 bg-brand-primary hover:bg-brand-primary/90 border-none h-14">
                      Explore Directory <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/labels" className="w-full sm:w-auto">
                    <Button variant="ghost" size="lg" className="w-full sm:w-auto rounded-full text-white hover:bg-white/10 h-14 border border-white/20">
                      Discover Labels
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                currentSlide === index
                  ? "bg-brand-primary w-8"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust & Impact Metrics */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            {[
              {
                icon: ShieldCheck,
                title: "Rigueur Institutionnelle",
                desc: "Des protocoles d'audit multicouches garantissant l'intégrité absolue de chaque structure certifiée.",
                color: "text-brand-primary"
              },
              {
                icon: Globe,
                title: "Impact Territorial",
                desc: "Une analyse précise du rayonnement socio-économique à l'échelle des écosystèmes productifs.",
                color: "text-brand-accent"
              },
              {
                icon: TrendingUp,
                title: "Croissance Durable",
                desc: "Accompagnement et indexation de la maturité des coopératives vers l'excellence opérationnelle.",
                color: "text-success"
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="group flex flex-col items-start gap-6">
                <div className={cn("w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-200 transition-transform group-hover:scale-105 group-hover:shadow-md", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-secondary mb-3">{feature.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Labels */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-4">Certification</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-brand-secondary tracking-tight">Référentiel des Labels Actifs</h3>
              <p className="mt-4 text-text-muted">Parcourez les différents programmes de labellisation reconnus par le conseil supérieur de la coopération.</p>
            </div>
            <Link to="/labels">
              <Button variant="outline" className="rounded-full px-8">Voir tout le catalogue</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {labelsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-slate-100 animate-pulse" />
              ))
            ) : (
              labels?.slice(0, 8).map((label) => (
                <Link key={label._id} to={`/labels/${label._id}`} className="group">
                  <Card className="h-full border border-slate-200 hover:border-brand-primary hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <div className="aspect-square w-32 flex items-center justify-center p-4 bg-slate-50 rounded-xl mb-6 group-hover:bg-brand-primary/5 transition-colors">
                        {label.logoUrl ? (
                          <img src={resolveImageUrl(label.logoUrl)} alt={label.name} className="w-full h-full object-cover" />
                        ) : (
                          <Award className="w-12 h-12 text-slate-300" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-2 block">{label?.sector || "Secteur"}</span>
                      <h4 className="text-base font-bold text-brand-secondary group-hover:text-brand-primary transition-colors line-clamp-2">{label?.name}</h4>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Information Feed (News) */}
      <section className="py-32 bg-brand-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between mb-16 pb-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-accent/20 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-brand-accent" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest">Actualités de l'écosystème</h2>
            </div>
            <Link to="/news" className="hidden sm:block">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-6 text-xs uppercase tracking-widest">Voir le flux</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {newsLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
              ))
            ) : (
              news.slice(0, 2).map((item) => (
                <motion.article
                  key={item._id}
                  whileHover={{ y: -5 }}
                  className="group"
                  onMouseEnter={() => prefetchArticle(item.slug)}
                >
                  <Link to={`/news/${item.slug}`} className="flex flex-col gap-8 p-8 md:p-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl transition-all">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                        <time className="text-xs font-semibold text-slate-400">
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "Récemment"}
                        </time>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-brand-accent group-hover:translate-x-1 transition-all" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 leading-tight group-hover:text-brand-accent transition-colors">{item?.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-medium">{item?.excerpt || (item?.content ? item.content.substring(0, 150) : "")}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-accent/70 group-hover:text-brand-accent transition-colors">
                      LIRE L'ARTICLE <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.article>
              ))
            )}
          </div>
          <Link to="/news" className="block sm:hidden mt-8 text-center">
            <Button variant="outline" className="w-full border-white/20 text-white rounded-full">Voir toutes les actualités</Button>
          </Link>
        </div>
      </section>

      {/* Final CTA Portal */}
      <section className="py-40 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-8 leading-tight">
                Prêt à certifier votre <br /> excellence cooperative ?
              </h2>
              <p className="text-slate-400 text-base md:text-lg mb-12 max-w-lg mx-auto leading-relaxed">
                Rejoignez le registre central et certifiez la maturité de votre structure pour intégrer les marchés d'excellence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/directory" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-16 px-10 rounded-full text-lg">
                    Démarrer l'Audit
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto text-white hover:text-brand-accent transition-colors font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" /> Parler à un conseiller
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
