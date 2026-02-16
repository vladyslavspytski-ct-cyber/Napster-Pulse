import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import {
  TEMPLATE_CATEGORIES_V2,
  getAllInterviewTypes,
  findCategoryById,
  findInterviewTypeById,
  findCategoryForType,
  type TemplateCategory,
  type InterviewType,
  type InterviewQuestion,
} from "@/mock/templatesDirectoryV2";

/* ── Animation variants ──────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2 } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.04 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/* ── Main component (uses URL params for steps) ──────────── */
const TemplateDirectory = () => {
  const { categoryId, typeId } = useParams();
  const navigate = useNavigate();

  // Determine current step
  if (typeId && categoryId) {
    return <TypeDetailView categoryId={categoryId} typeId={typeId} />;
  }
  if (categoryId) {
    return <CategoryDetailView categoryId={categoryId} />;
  }
  return <CategoriesHomeView />;
};

/* ═══════════════════════════════════════════════════════════
   Step 1: Categories Home
   ═══════════════════════════════════════════════════════════ */
function CategoriesHomeView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const allTypes = useMemo(() => getAllInterviewTypes(), []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const matchedCategories = TEMPLATE_CATEGORIES_V2.filter(
      (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
    );
    const matchedTypes = allTypes
      .filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags?.some((tag) => tag.toLowerCase().includes(q)))
      .map((t) => ({ ...t, category: findCategoryForType(t.id)! }));
    return { categories: matchedCategories, types: matchedTypes };
  }, [searchQuery, allTypes]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">Template Directory</h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Browse {TEMPLATE_CATEGORIES_V2.length} categories and {allTypes.length} interview templates.
              Find the right starting point, then customize with AI.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories or interview types…"
                className="pl-11 h-12 text-sm bg-card border-border/60 rounded-2xl shadow-sm focus-visible:ring-primary/30"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {searchResults ? (
              <motion.div key="search" {...pageVariants}>
                {/* Search results */}
                {searchResults.categories.length === 0 && searchResults.types.length === 0 && (
                  <div className="text-center py-20">
                    <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">No results for "{searchQuery}"</p>
                  </div>
                )}

                {searchResults.categories.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categories</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {searchResults.categories.map((cat) => (
                        <CategoryCard key={cat.id} category={cat} onClick={() => { setSearchQuery(""); navigate(`/templates/${cat.id}`); }} />
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.types.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Interview Types</h2>
                    <div className="space-y-2">
                      {searchResults.types.map((t) => (
                        <motion.button
                          key={t.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => { setSearchQuery(""); navigate(`/templates/${t.category.id}/${t.id}`); }}
                          className="w-full text-left glass-card rounded-2xl p-4 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{t.category.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{t.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{t.category.title} → {t.title}</p>
                            </div>
                            <span className="text-xs text-muted-foreground/60">{t.questionCount} questions</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="categories" variants={staggerContainer} initial="initial" animate="animate">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TEMPLATE_CATEGORIES_V2.map((cat) => (
                    <motion.div key={cat.id} variants={staggerItem}>
                      <CategoryCard category={cat} onClick={() => navigate(`/templates/${cat.id}`)} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ── Category Card ───────────────────────────────────────── */
function CategoryCard({ category, onClick }: { category: TemplateCategory; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left glass-card rounded-2xl p-5 hover:shadow-md hover:scale-[1.01] transition-all duration-200 group"
    >
      <div className="flex items-start gap-3.5">
        <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 text-lg", category.accentColor)}>
          {category.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{category.title}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{category.description}</p>
          <div className="flex items-center gap-3 mt-2.5">
            <span className="text-[11px] text-muted-foreground/70">{category.typeCount} types</span>
            <span className="text-[11px] text-muted-foreground/70">{category.questionCount} questions</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors mt-1 flex-shrink-0" />
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   Step 2: Category Detail
   ═══════════════════════════════════════════════════════════ */
function CategoryDetailView({ categoryId }: { categoryId: string }) {
  const navigate = useNavigate();
  const category = findCategoryById(categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 text-center">
          <p className="text-muted-foreground">Category not found.</p>
          <button onClick={() => navigate("/templates")} className="text-primary text-sm mt-4 hover:underline">← Back to directory</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <motion.div {...pageVariants}>
            {/* Back link */}
            <button onClick={() => navigate("/templates")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              All categories
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl flex-shrink-0", category.accentColor)}>
                {category.emoji}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{category.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary" className="rounded-full text-[11px]">{category.typeCount} interview types</Badge>
                  <Badge variant="secondary" className="rounded-full text-[11px]">{category.questionCount} questions</Badge>
                </div>
              </div>
            </div>

            {/* Interview types list */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
              {category.interviewTypes.map((type) => (
                <motion.button
                  key={type.id}
                  variants={staggerItem}
                  onClick={() => navigate(`/templates/${categoryId}/${type.id}`)}
                  className="w-full text-left glass-card rounded-2xl p-5 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{type.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{type.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] text-muted-foreground/70">{type.questionCount} questions</span>
                        {type.followupCount > 0 && (
                          <span className="text-[11px] text-muted-foreground/70">{type.followupCount} follow-ups</span>
                        )}
                        {type.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Step 3: Interview Type Detail (questions)
   ═══════════════════════════════════════════════════════════ */
function TypeDetailView({ categoryId, typeId }: { categoryId: string; typeId: string }) {
  const navigate = useNavigate();
  const category = findCategoryById(categoryId);
  const interviewType = findInterviewTypeById(typeId);

  if (!category || !interviewType) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 text-center">
          <p className="text-muted-foreground">Interview type not found.</p>
          <button onClick={() => navigate("/templates")} className="text-primary text-sm mt-4 hover:underline">← Back to directory</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <motion.div {...pageVariants}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
              <button onClick={() => navigate("/templates")} className="hover:text-foreground transition-colors">All categories</button>
              <ChevronRight className="w-3 h-3" />
              <button onClick={() => navigate(`/templates/${categoryId}`)} className="hover:text-foreground transition-colors">{category.title}</button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{interviewType.title}</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-xl flex-shrink-0", category.accentColor)}>
                  {category.emoji}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{interviewType.title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{interviewType.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary" className="rounded-full text-[11px]">{interviewType.questionCount} questions</Badge>
                    {interviewType.followupCount > 0 && (
                      <Badge variant="secondary" className="rounded-full text-[11px]">{interviewType.followupCount} follow-ups</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions list */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3 mb-8">
              {interviewType.questions.map((question, i) => (
                <QuestionRow key={question.id} question={question} index={i} />
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sticky bottom-6 z-10">
              <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4 shadow-lg">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{interviewType.title}</p>
                  <p className="text-xs text-muted-foreground">{interviewType.questionCount} questions ready to customize</p>
                </div>
                <PrimaryButton
                  className="flex-shrink-0 gap-2"
                  onClick={() => navigate(`/create-interview-from-template?templateId=${interviewType.id}`)}
                >
                  <Sparkles className="w-4 h-4" />
                  Start with This Template
                </PrimaryButton>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ── Question Row with optional followup expand ──────────── */
function QuestionRow({ question, index }: { question: InterviewQuestion; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasFollowups = question.followups && question.followups.length > 0;

  return (
    <motion.div variants={staggerItem} className="glass-card rounded-2xl overflow-hidden">
      <div className="p-4 flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground leading-relaxed">{question.text}</p>
          {hasFollowups && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-2 text-[11px] text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
              {question.followups!.length} follow-up{question.followups!.length > 1 ? "s" : ""}
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {expanded && hasFollowups && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-14 space-y-1.5">
              {question.followups!.map((fu) => (
                <div key={fu.id} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary/50 mt-0.5">↳</span>
                  <span className="leading-relaxed">{fu.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default TemplateDirectory;
