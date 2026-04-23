import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, User, Mail, Lock, AtSign, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { toast } from "react-hot-toast";

function SignupPage() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("LES MOTS DE PASSE NE CORRESPONDENT PAS");
      return;
    }
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", { name, username, email, password });
      login(response.data.token);
      toast.success("COMPTE CRÉÉ — BIENVENUE DANS LE RÉSEAU");
      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "ERREUR LORS DE L'INSCRIPTION");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="relative z-10 text-center max-w-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/20"
          >
            <ShieldCheck className="w-10 h-10 text-accent" />
          </motion.div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-6 italic italic">Adhésion Réseau</h2>
          <p className="text-primary-foreground/60 text-base leading-relaxed font-medium">
            Initialisez votre processus de certification et accédez aux outils d'excellence panafricaine.
          </p>
          <div className="mt-12 space-y-4">
             <div className="flex items-center gap-3 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                <span className="w-8 h-px bg-white/20" /> Audit & Certification
             </div>
             <div className="flex items-center gap-3 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                <span className="w-8 h-px bg-white/20" /> Networking Business
             </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-10 left-10">
           <Link to="/login" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour Connexion
           </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md py-12">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">DGIAESG</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-foreground tracking-tight mb-2 uppercase italic">Inscription</h1>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent" /> Nouveau compte DGIA-ESG
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Nom complet</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                    className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="JEAN DUPONT" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Username</label>
                <div className="relative group">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                    className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="JEAN_D" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Adresse Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="EMAIL@NETWORK.COM" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Code Accès</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="••••••••" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Confirmation</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                    className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="••••••••" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Créer le compte <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-center text-muted-foreground">
            Vous faites déjà partie du réseau ?{" "}
            <Link to="/login" className="text-primary hover:text-accent transition-colors underline underline-offset-4">Connectez-vous</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default SignupPage;
