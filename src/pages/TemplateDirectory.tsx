import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  useTemplates,
  type Template,
  type TemplateCategory,
} from "@/hooks/api/useTemplates";

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

/**
 * Get inline style for category accent background
 */
function getCategoryAccentStyle(color: string): React.CSSProperties {
  return {
    background: `linear-gradient(135deg, ${color}20 0%, ${color}08 100%)`,
  };
}

/* ── Main component (uses URL params for steps) ──────────── */
const TemplateDirectory = () => {
  const { categoryId, typeId } = useParams();

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
  const { templates, categories, isLoading, error } = useTemplates();

  // Search results - search across title, scenario, category, subcategory
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    // Search categories
    const matchedCategories = categories.filter(
      (c) => c.title.toLowerCase().includes(q)
    );

    // Search templates (interview types)
    const matchedTemplates = templates
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.scenario?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.subcategory?.toLowerCase().includes(q)
      )
      .map((t) => {
        const category = categories.find((c) =>
          c.templates.some((ct) => ct.id === t.id)
        );
        return { template: t, category };
      });

    // Also include categories that have matching templates
    const categoriesWithMatchingTemplates = categories.filter(
      (c) =>
        !matchedCategories.includes(c) &&
        c.templates.some(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.scenario?.toLowerCase().includes(q) ||
            t.subcategory?.toLowerCase().includes(q)
        )
    );

    return {
      categories: [...matchedCategories, ...categoriesWithMatchingTemplates],
      templates: matchedTemplates,
    };
  }, [searchQuery, templates, categories]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="section-container flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-sm">Loading templates...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="section-container text-center py-20">
            <p className="text-destructive text-sm mb-4">Failed to load templates</p>
            <p className="text-muted-foreground text-xs">{error.message}</p>
          </div>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">Template Directory</h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Browse {categories.length} categories and {templates.length} interview templates.
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
                placeholder="Search categories or interview types..."
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
                {searchResults.categories.length === 0 && searchResults.templates.length === 0 && (
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

                {searchResults.templates.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Interview Types</h2>
                    <div className="space-y-2">
                      {searchResults.templates.map(({ template, category }) => (
                        <motion.button
                          key={template.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => { setSearchQuery(""); navigate(`/templates/${category?.id}/${template.id}`); }}
                          className="w-full text-left glass-card rounded-2xl p-4 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{template.emoji || category?.emoji || "📋"}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{template.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {template.category}
                                {template.subcategory && ` → ${template.subcategory}`}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground/60">{template.questions.length} questions</span>
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
                {categories.length === 0 ? (
                  <div className="text-center py-20">
                    <Sparkles className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">No templates available yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                      <motion.div key={cat.id} variants={staggerItem}>
                        <CategoryCard category={cat} onClick={() => navigate(`/templates/${cat.id}`)} />
                      </motion.div>
                    ))}
                  </div>
                )}
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
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
          style={getCategoryAccentStyle(category.color)}
        >
          {category.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{category.title}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {category.templates[0]?.scenario || `${category.typeCount} interview types available`}
          </p>
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
  const { findCategoryById, isLoading, error } = useTemplates();
  const category = findCategoryById(categoryId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="section-container flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !category) {
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
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={getCategoryAccentStyle(category.color)}
              >
                {category.emoji}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{category.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.templates[0]?.scenario || "Interview templates for this category"}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary" className="rounded-full text-[11px]">{category.typeCount} interview types</Badge>
                  <Badge variant="secondary" className="rounded-full text-[11px]">{category.questionCount} questions</Badge>
                </div>
              </div>
            </div>

            {/* Interview types list */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
              {category.templates.map((template) => (
                <motion.button
                  key={template.id}
                  variants={staggerItem}
                  onClick={() => navigate(`/templates/${categoryId}/${template.id}`)}
                  className="w-full text-left glass-card rounded-2xl p-5 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{template.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{template.scenario}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] text-muted-foreground/70">{template.questions.length} questions</span>
                        {template.subcategory && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{template.subcategory}</span>
                        )}
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
  const { findCategoryById, findTemplateById, isLoading, error } = useTemplates();
  const category = findCategoryById(categoryId);
  const template = findTemplateById(typeId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="section-container flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !category || !template) {
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

  // Sort questions by order
  const sortedQuestions = [...template.questions].sort((a, b) => a.order - b.order);

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
              <span className="text-foreground font-medium">{template.title}</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={getCategoryAccentStyle(template.color || category.color)}
                >
                  {template.emoji || category.emoji}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{template.title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{template.scenario}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary" className="rounded-full text-[11px]">{sortedQuestions.length} questions</Badge>
                    {template.subcategory && (
                      <Badge variant="secondary" className="rounded-full text-[11px]">{template.subcategory}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions list */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
              {sortedQuestions.map((question, i) => (
                <QuestionRow key={question.id} questionText={question.text} index={i} />
              ))}
            </motion.div>

            {/* Separator + CTA */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10 mb-8">
              <div className="h-px w-full bg-border/60 mb-8" />
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">Ready to go?</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    Questions pre-filled · Edit, reorder & customize with AI
                  </p>
                </div>
                <PrimaryButton
                  className="gap-2 px-6"
                  onClick={() => navigate(`/create-interview-from-template?templateId=${typeId}`)}
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

/* ── Question Row ───────────────────────────────────────── */
function QuestionRow({ questionText, index }: { questionText: string; index: number }) {
  return (
    <motion.div variants={staggerItem} className="glass-card rounded-2xl overflow-hidden">
      <div className="p-4 flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground leading-relaxed">{questionText}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default TemplateDirectory;
