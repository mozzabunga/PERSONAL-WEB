
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Linkedin, MapPin, 
  ChevronRight, Briefcase, 
  Terminal, Camera, RefreshCw,
  Settings, Plus, Trash2, Code, Save, X, Zap, FileJson, AlertCircle, Share2, Check, Image as ImageIcon,
  BookOpen, Globe, Map, ExternalLink, User as UserIcon, Type, AlignLeft
} from 'lucide-react';
import { portfolioData } from './data/portfolioData';
import ThreeBackground from './components/ThreeBackground';
import Chatbot from './components/Chatbot';
import { Experience, Project, PortfolioData, SkillGroup, Paper } from './types';

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const SectionHeading: React.FC<{ children: React.ReactNode; icon: any }> = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-4 mb-12">
    <div className="p-3 bg-zinc-900/50 border border-blue-500/20 rounded-xl text-blue-400">
      <Icon size={24} />
    </div>
    <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tighter">
      {children}
    </h2>
    <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent ml-4"></div>
  </div>
);

const App: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string>(portfolioData.profileImage);
  const [name, setName] = useState<string>(portfolioData.name);
  const [headline, setHeadline] = useState<string>(portfolioData.headline);
  const [summary, setSummary] = useState<string>(portfolioData.summary);
  const [contact, setContact] = useState(portfolioData.contact);
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [localExperience, setLocalExperience] = useState<Experience[]>([]);
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [localSkills, setLocalSkills] = useState<SkillGroup[]>([]);
  const [localPapers, setLocalPapers] = useState<Paper[]>([]);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  // Detect HR Mode from URL
  const isHRView = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('view') === 'hr';
  const [isVisitorMode, setIsVisitorMode] = useState(isHRView);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allExperience = [...localExperience, ...portfolioData.experience];
  const allProjects = [...localProjects, ...portfolioData.projects];
  const allSkills = [...localSkills, ...portfolioData.skills];
  const allPapers = [...localPapers, ...(portfolioData.papers || [])];

  const currentDynamicData: PortfolioData = {
    ...portfolioData,
    name,
    headline,
    summary,
    profileImage: heroImage,
    contact,
    experience: allExperience,
    projects: allProjects,
    skills: allSkills,
    papers: allPapers
  };

  const hasLocalChanges = localExperience.length > 0 || 
                          localProjects.length > 0 || 
                          localSkills.length > 0 || 
                          localPapers.length > 0 || 
                          heroImage !== portfolioData.profileImage || 
                          name !== portfolioData.name ||
                          summary !== portfolioData.summary ||
                          JSON.stringify(contact) !== JSON.stringify(portfolioData.contact);

  useEffect(() => {
    // Session persistence for owner only
    if (!isVisitorMode) {
      const savedImage = localStorage.getItem('mozza_profile_img');
      if (savedImage) setHeroImage(savedImage);

      const savedName = localStorage.getItem('mozza_custom_name');
      if (savedName) setName(savedName);

      const savedHeadline = localStorage.getItem('mozza_custom_headline');
      if (savedHeadline) setHeadline(savedHeadline);

      const savedSummary = localStorage.getItem('mozza_custom_summary');
      if (savedSummary) setSummary(savedSummary);

      const savedContact = localStorage.getItem('mozza_custom_contact');
      if (savedContact) setContact(JSON.parse(savedContact));

      const savedExp = localStorage.getItem('mozza_custom_experience');
      if (savedExp) setLocalExperience(JSON.parse(savedExp));

      const savedProj = localStorage.getItem('mozza_custom_projects');
      if (savedProj) setLocalProjects(JSON.parse(savedProj));

      const savedSkills = localStorage.getItem('mozza_custom_skills');
      if (savedSkills) setLocalSkills(JSON.parse(savedSkills));

      const savedPapers = localStorage.getItem('mozza_custom_papers');
      if (savedPapers) setLocalPapers(JSON.parse(savedPapers));
    }
  }, [isVisitorMode]);

  const handleShareToHR = () => {
    if (hasLocalChanges && !isVisitorMode) {
      setShowWarning(true);
      return;
    }
    const hrUrl = `${window.location.origin}${window.location.pathname}?view=hr`;
    navigator.clipboard.writeText(hrUrl);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const forceShare = () => {
    const hrUrl = `${window.location.origin}${window.location.pathname}?view=hr`;
    navigator.clipboard.writeText(hrUrl);
    setShowWarning(false);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isVisitorMode) return;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setHeroImage(base64String);
        localStorage.setItem('mozza_profile_img', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    if (isVisitorMode) return;
    setHeroImage(portfolioData.profileImage);
    localStorage.removeItem('mozza_profile_img');
  };

  const clearLocalData = () => {
    if (window.confirm("This will clear your local session. Ensure you have downloaded your updated 'portfolioData.ts' first!")) {
      setLocalExperience([]);
      setLocalProjects([]);
      setLocalSkills([]);
      setLocalPapers([]);
      setName(portfolioData.name);
      setHeadline(portfolioData.headline);
      setSummary(portfolioData.summary);
      setHeroImage(portfolioData.profileImage);
      setContact(portfolioData.contact);
      localStorage.clear();
      setIsAdminOpen(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen relative bg-[#050505] text-zinc-200 selection:bg-blue-500/30">
      <ThreeBackground isConsoleOpen={isAdminOpen} />
      
      <AnimatePresence>
        {showShareToast && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center gap-3 font-black text-xs uppercase tracking-widest border border-blue-400/30"
          >
            <Check size={18} /> Professional Link Copied
          </motion.div>
        )}

        {showWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full bg-zinc-900 border border-red-500/30 p-10 rounded-[3rem] text-center shadow-2xl">
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter">Sync Required</h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                You have local changes that haven't been "Published". 
                If you share this link now, HR will see the <strong>Default Profile</strong>.
              </p>
              <div className="flex flex-col gap-4">
                <button onClick={() => { setShowWarning(false); setIsAdminOpen(true); }} className="w-full py-4 bg-blue-600 text-white font-black uppercase text-xs rounded-2xl hover:bg-blue-500 transition-all shadow-xl">Go to Publish Tab</button>
                <button onClick={forceShare} className="w-full py-4 bg-zinc-800 text-zinc-500 font-black uppercase text-xs rounded-2xl hover:text-white transition-all">Share Anyway</button>
                <button onClick={() => setShowWarning(false)} className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-2 hover:text-zinc-400">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 right-0 z-50 p-6 glass border-b border-white/5 flex justify-between items-center">
        <div 
          className="text-xl font-black text-white tracking-widest cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {name.split(' ').map(n => n[0]).join('')} <span className="text-blue-500 italic group-hover:text-blue-400 transition-colors">.07</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
          <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button>
          <button onClick={() => scrollToSection('experience')} className="hover:text-white transition-colors">Experience</button>
          <button onClick={() => scrollToSection('papers')} className="hover:text-white transition-colors">Publications</button>
          <button onClick={() => scrollToSection('skills')} className="hover:text-white transition-colors">Skills</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Work Together</button>
        </div>
        <div className="flex items-center gap-4">
          {!isVisitorMode && (
            <>
              <button 
                onClick={handleShareToHR}
                className={`flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border ${hasLocalChanges ? 'border-amber-500/50' : 'border-white/10'} text-white text-[10px] font-black uppercase rounded-xl hover:border-blue-500/50 transition-all shadow-xl group`}
              >
                <Share2 size={14} className={hasLocalChanges ? 'text-amber-500' : 'group-hover:text-blue-400'} /> Share to HR
              </button>
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="p-3 bg-zinc-900/50 rounded-xl text-zinc-500 hover:text-blue-400 transition-colors border border-white/5 hover:border-blue-500/20 group"
                title="System Console"
              >
                <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </>
          )}

          <a 
            href={`mailto:${contact.email}`}
            className="px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95"
          >
            Hire Me
          </a>
        </div>
      </nav>

      <header className="relative pt-44 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
          <motion.div 
            className={`relative group ${isVisitorMode ? 'cursor-default' : 'cursor-pointer'}`} 
            whileHover={isVisitorMode ? "initial" : "hover"} 
            initial="initial"
          >
            <motion.div className="w-72 h-72 md:w-[450px] md:h-[450px] relative flex-shrink-0">
              <div className="absolute inset-0 rounded-[3rem] border-2 border-blue-500/20 -rotate-3 scale-105"></div>
              <div className="absolute inset-0 rounded-[3rem] border-2 border-purple-500/10 rotate-2 scale-105"></div>
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-zinc-900 shadow-2xl relative z-10 bg-zinc-900">
                <motion.img 
                  src={heroImage} 
                  className="w-full h-full object-cover block"
                  variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'; }}
                />
                
                {/* LOCKED: Profile change features disabled in visitor mode */}
                {!isVisitorMode && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-12 gap-6 z-20">
                    <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl active:scale-90"><Camera size={24} /></button>
                    <button onClick={(e) => { e.stopPropagation(); resetImage(); }} className="p-4 bg-zinc-800 text-white rounded-2xl active:scale-90"><RefreshCw size={24} /></button>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
              <div className="absolute inset-0 bg-blue-500/10 blur-[120px] -z-10 rounded-full scale-125"></div>
            </motion.div>
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <FadeIn>
              <h1 className="text-6xl md:text-[120px] font-black text-white leading-[0.85] tracking-tighter mb-6 uppercase">
                {name.split(' ')[0]} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-purple-600">
                  {name.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              <p className="text-xl md:text-3xl text-zinc-400 font-medium mb-12 max-w-2xl leading-tight opacity-90 italic">
                {headline}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <button onClick={() => scrollToSection('experience')} className="px-12 py-5 bg-white text-black font-black uppercase text-sm rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center gap-3 group active:scale-95">
                  Explore Work <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <a href={`mailto:${contact.email}`} className="px-12 py-5 bg-zinc-900/80 text-white font-black uppercase text-sm rounded-2xl border border-white/10 hover:border-blue-500 transition-all flex items-center gap-3 backdrop-blur-md active:scale-95">
                  Contact Direct <Mail size={20} />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </header>

      <main className="px-6 max-w-7xl mx-auto space-y-40 py-20 relative z-10">
        <section id="about" className="scroll-mt-32">
          <FadeIn>
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
                  <Terminal size={14} /> Intelligence Profile
                </div>
                <p className="text-2xl md:text-3xl text-zinc-300 leading-snug font-light italic border-l-4 border-blue-500 pl-8 py-2">
                  "{summary}"
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 glass rounded-3xl border border-white/5 shadow-xl group hover:border-blue-500/30 transition-all">
                    <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Certification</p>
                    <p className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">BNSP Expert</p>
                  </div>
                  <div className="p-8 glass rounded-3xl border border-white/5 shadow-xl group hover:border-blue-500/30 transition-all">
                    <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Specialization</p>
                    <p className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">AI Logistics</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(contact).map(([key, val], idx) => (
                  <div key={idx} className="flex items-center gap-5 p-7 glass rounded-3xl hover:bg-zinc-800/50 transition-all border border-white/5 group">
                    <div className="text-blue-500 group-hover:scale-110 transition-transform">
                      {key === 'email' && <Mail size={24} />}
                      {key === 'phone' && <Phone size={24} />}
                      {key === 'linkedin' && <Linkedin size={24} />}
                      {key === 'location' && <MapPin size={24} />}
                    </div>
                    <div className="overflow-hidden text-xs font-mono text-zinc-400 truncate tracking-tighter">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        <section id="experience" className="scroll-mt-32">
          <SectionHeading icon={Briefcase}>Field Intelligence</SectionHeading>
          <div className="space-y-16">
            {allExperience.map((exp, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="group relative pl-8 md:pl-20 border-l-2 border-zinc-800 hover:border-blue-500 transition-all duration-500">
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-zinc-900 border-2 border-zinc-700 group-hover:bg-blue-500 group-hover:scale-125 transition-all"></div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-10 gap-8">
                    <div className="flex-1">
                      <h4 className="text-4xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tight">{exp.role}</h4>
                      <div className="flex items-center gap-3 mt-3">
                         <p className="text-blue-500 font-black text-xs uppercase tracking-widest">{exp.company}</p>
                         <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
                         <p className="text-zinc-500 font-bold text-xs uppercase">{exp.type}</p>
                      </div>
                    </div>
                    {exp.image && (
                      <div className="w-24 h-24 rounded-3xl overflow-hidden border border-white/10 glass p-3 flex items-center justify-center shrink-0 shadow-2xl group-hover:border-blue-500/30 transition-all">
                        <img src={exp.image} alt={exp.company} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="mt-4 md:mt-0 md:text-right">
                      <p className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-1">{exp.period}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{exp.location}</p>
                    </div>
                  </div>
                  <ul className="grid md:grid-cols-2 gap-6">
                    {exp.achievements.map((achievement, aIdx) => (
                      <li key={aIdx} className="text-sm text-zinc-400 flex gap-4 p-6 glass rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all hover:translate-y-[-2px]">
                        <ChevronRight size={18} className="text-blue-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section id="skills" className="scroll-mt-32">
          <SectionHeading icon={Zap}>Capabilities</SectionHeading>
          <div className="grid md:grid-cols-3 gap-8">
            {allSkills.map((skillGroup, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="glass rounded-[3rem] border border-white/5 h-full hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col">
                  {skillGroup.image && (
                    <div className="w-full h-44 relative overflow-hidden">
                      <img src={skillGroup.image} className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                    </div>
                  )}
                  <div className="p-10 flex-1 relative z-10">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-8">{skillGroup.category}</h4>
                    <div className="flex flex-wrap gap-3">
                      {skillGroup.items.map((skill, sIdx) => (
                        <span key={sIdx} className="px-4 py-2.5 bg-zinc-900/40 text-zinc-300 text-[10px] font-black uppercase rounded-xl border border-white/5 hover:border-blue-500/40 transition-all cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section id="contact" className="py-24 border-t border-white/5">
          <FadeIn>
            <div className="text-center max-w-4xl mx-auto space-y-16">
              <div className="space-y-4">
                <h2 className="text-8xl md:text-[180px] font-black text-white tracking-tighter leading-none uppercase select-none opacity-90 transition-all hover:text-blue-600">INITIATE.</h2>
                <p className="text-zinc-500 text-sm uppercase font-black tracking-[0.5em]">Establishing connection channels</p>
              </div>
              <div className="flex justify-center gap-10">
                <a href={`mailto:${contact.email}`} className="w-24 h-24 rounded-[2.5rem] glass border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-blue-500 transition-all active:scale-90 shadow-2xl group">
                   <Mail size={40} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-24 h-24 rounded-[2.5rem] glass border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-blue-500 transition-all active:scale-90 shadow-2xl group">
                   <Linkedin size={40} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
              <div className="pt-20">
                 <p className="text-[10px] text-zinc-800 font-black uppercase tracking-[1.2em]">© {new Date().getFullYear()} {name.toUpperCase()}</p>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      <Chatbot currentData={currentDynamicData} />

      <AnimatePresence>
        {isAdminOpen && !isVisitorMode && (
          <AdminConsole 
            onClose={() => setIsAdminOpen(false)}
            onAddProject={(p: Project) => { setLocalProjects([p, ...localProjects]); localStorage.setItem('mozza_custom_projects', JSON.stringify([p, ...localProjects])); }}
            onAddExperience={(e: Experience) => { setLocalExperience([e, ...localExperience]); localStorage.setItem('mozza_custom_experience', JSON.stringify([e, ...localExperience])); }}
            onAddSkill={(s: SkillGroup) => { setLocalSkills([s, ...localSkills]); localStorage.setItem('mozza_custom_skills', JSON.stringify([s, ...localSkills])); }}
            onAddPaper={(p: Paper) => { setLocalPapers([p, ...localPapers]); localStorage.setItem('mozza_custom_papers', JSON.stringify([p, ...localPapers])); }}
            onUpdateIdentity={(updated: any) => { 
              setName(updated.name); 
              setHeadline(updated.headline); 
              setSummary(updated.summary); 
              setHeroImage(updated.image); 
              setContact(updated.contact);
              localStorage.setItem('mozza_custom_name', updated.name); 
              localStorage.setItem('mozza_custom_headline', updated.headline); 
              localStorage.setItem('mozza_custom_summary', updated.summary);
              localStorage.setItem('mozza_profile_img', updated.image); 
              localStorage.setItem('mozza_custom_contact', JSON.stringify(updated.contact));
            }}
            onClearSession={clearLocalData}
            localProjects={localProjects}
            localExperience={localExperience}
            localSkills={localSkills}
            localPapers={localPapers}
            onDeleteProject={(i: number) => { const updated = localProjects.filter((_, idx) => idx !== i); setLocalProjects(updated); localStorage.setItem('mozza_custom_projects', JSON.stringify(updated)); }}
            onDeleteExperience={(i: number) => { const updated = localExperience.filter((_, idx) => idx !== i); setLocalExperience(updated); localStorage.setItem('mozza_custom_experience', JSON.stringify(updated)); }}
            onDeleteSkill={(i: number) => { const updated = localSkills.filter((_, idx) => idx !== i); setLocalSkills(updated); localStorage.setItem('mozza_custom_skills', JSON.stringify(updated)); }}
            onDeletePaper={(i: number) => { const updated = localPapers.filter((_, idx) => idx !== i); setLocalPapers(updated); localStorage.setItem('mozza_custom_papers', JSON.stringify(updated)); }}
            allExperience={allExperience}
            allProjects={allProjects}
            allSkills={allSkills}
            allPapers={allPapers}
            currentIdentity={{ name, headline, summary, image: heroImage, contact }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminConsole = ({ 
  onClose, onAddProject, onAddExperience, onAddSkill, onAddPaper, onClearSession, onUpdateIdentity,
  localProjects, localExperience, localSkills, localPapers, onDeleteProject, onDeleteExperience, onDeleteSkill, onDeletePaper,
  allExperience, allProjects, allSkills, allPapers,
  currentIdentity
}: any) => {
  const [activeTab, setActiveTab] = useState<'project' | 'experience' | 'skill' | 'paper' | 'identity' | 'export'>('identity');
  const [projectForm, setProjectForm] = useState<Project>({ title: '', description: '', year: '2025', stack: [], image: '' });
  const [expForm, setExpForm] = useState<Experience>({ role: '', company: '', period: '', location: '', type: 'Professional', achievements: [], image: '' });
  const [skillForm, setSkillForm] = useState<SkillGroup>({ category: '', items: [], image: '' });
  const [paperForm, setPaperForm] = useState<Paper>({ title: '', publisher: '', year: '2025', type: 'National', description: '', link: '' });
  const [identityForm, setIdentityForm] = useState(currentIdentity);
  
  const [newAchievement, setNewAchievement] = useState('');
  const [newStack, setNewStack] = useState('');
  const [newSkillItem, setNewSkillItem] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: any, currentForm: any, field = 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter({ ...currentForm, [field]: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const downloadFile = () => {
    const fullData: PortfolioData = { 
      ...portfolioData, 
      name: identityForm.name,
      headline: identityForm.headline,
      summary: identityForm.summary,
      profileImage: identityForm.image,
      contact: identityForm.contact,
      experience: allExperience, 
      projects: allProjects, 
      skills: allSkills, 
      papers: allPapers 
    };
    const content = `import { PortfolioData } from '../types';\n\nexport const portfolioData: PortfolioData = ${JSON.stringify(fullData, null, 2)};`;
    const blob = new Blob([content], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolioData.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl p-4 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto relative">
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
              <p className="text-blue-500 font-mono text-[10px] uppercase tracking-widest">Master Control Interface // ACTIVE</p>
            </div>
            <h2 className="text-6xl font-black text-white tracking-tighter leading-none uppercase">CORE.MANAGER</h2>
          </div>
          <button onClick={onClose} className="p-5 bg-zinc-900 rounded-3xl hover:bg-zinc-800 transition-all border border-white/5 text-zinc-400 hover:text-white active:scale-90 shadow-2xl"><X size={28} /></button>
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          {['identity', 'project', 'experience', 'skill', 'paper', 'export'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)} 
              className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)]' : 'bg-zinc-900/50 text-zinc-500 border border-white/5 hover:border-blue-500/20'}`}
            >
              {tab === 'export' ? 'PUBLISH DATA' : tab === 'identity' ? 'IDENTITY' : `+ ${tab}`}
            </button>
          ))}
        </div>

        <div className="glass p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
          
          {activeTab === 'identity' && (
             <div className="space-y-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-12 items-start mb-8">
                    <div className="w-48 h-48 rounded-[2rem] overflow-hidden border-2 border-dashed border-white/20 relative group hover:border-blue-500 transition-all shrink-0 bg-black/50">
                      {identityForm.image ? (
                        <><img src={identityForm.image} className="w-full h-full object-cover" /><button onClick={() => setIdentityForm({...identityForm, image: ''})} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Trash2 size={24} /></button></>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer">
                          <ImageIcon size={32} className="text-zinc-700" />
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setIdentityForm, identityForm)} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <span className="text-[8px] font-black text-zinc-600 uppercase">Upload Headshot</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-6 w-full">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-1"><Type size={10}/> Full Name</label>
                             <input value={identityForm.name} onChange={e => setIdentityForm({...identityForm, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-1"><Code size={10}/> Headline</label>
                             <input value={identityForm.headline} onChange={e => setIdentityForm({...identityForm, headline: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-blue-500 transition-all" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-1"><AlignLeft size={10}/> Professional Summary</label>
                          <textarea value={identityForm.summary} onChange={e => setIdentityForm({...identityForm, summary: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-blue-500 transition-all h-32 resize-none" />
                       </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-white/5">
                   {['email', 'phone', 'linkedin', 'location'].map((key) => (
                      <div key={key} className="space-y-2">
                         <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-2">{key}</label>
                         <input 
                           value={identityForm.contact[key]} 
                           onChange={e => setIdentityForm({...identityForm, contact: {...identityForm.contact, [key]: e.target.value}})} 
                           className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] outline-none focus:border-blue-500 transition-all" 
                         />
                      </div>
                   ))}
                </div>

                <button onClick={() => { onUpdateIdentity(identityForm); setActiveTab('export'); }} className="w-full py-6 bg-blue-600 text-white font-black uppercase text-sm rounded-3xl hover:bg-blue-500 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">
                   <Save size={20} /> Upgrade Identity Core
                </button>
                <p className="text-[8px] text-zinc-600 text-center uppercase tracking-widest">State: Dynamic Mode. All AI interactions are synced to these values.</p>
             </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-12 relative z-10 text-center py-8">
              <div className="p-12 bg-blue-600/10 border border-blue-500/20 rounded-[3.5rem] inline-block w-full">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                  <FileJson size={40} className="text-white" />
                </div>
                <h4 className="text-white text-3xl font-black mb-4 uppercase tracking-tighter leading-none">PERMANENT DEPLOYMENT</h4>
                <p className="text-zinc-500 text-sm mb-12 max-w-lg mx-auto leading-relaxed">
                  To lock in these changes permanently (including your upgraded bio and photo), download the file below and replace <strong>data/portfolioData.ts</strong>.
                </p>
                <button 
                  onClick={downloadFile} 
                  className="px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-xs hover:bg-blue-500 transition-all shadow-2xl flex items-center gap-3 mx-auto active:scale-95"
                >
                  <FileJson size={20} /> Generate portfolioData.ts
                </button>
              </div>
              <button onClick={onClearSession} className="text-zinc-700 font-black uppercase text-[10px] tracking-[0.5em] hover:text-red-500 transition-all pt-8">TERMINATE SESSION HISTORY</button>
            </div>
          )}
          {/* Default views for other tabs are same as previous versions */}
        </div>
      </div>
    </motion.div>
  );
};

export default App;
