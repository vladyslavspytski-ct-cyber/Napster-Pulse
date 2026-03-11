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
  LayoutGrid,
  Layers,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ElectronPageWrapper from "@/components/electron/ElectronPageWrapper";
import { useIsElectron } from "@/lib/electron";
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

/* ── Department chip colors ─────────────────────────────────── */
const DEPT_CHIP_COLORS = [
  { bg: "bg-violet-500", bgLight: "bg-violet-500/15", text: "text-violet-600", border: "border-violet-500/30" },
  { bg: "bg-cyan-500", bgLight: "bg-cyan-500/15", text: "text-cyan-600", border: "border-cyan-500/30" },
  { bg: "bg-emerald-500", bgLight: "bg-emerald-500/15", text: "text-emerald-600", border: "border-emerald-500/30" },
  { bg: "bg-amber-500", bgLight: "bg-amber-500/15", text: "text-amber-600", border: "border-amber-500/30" },
  { bg: "bg-rose-500", bgLight: "bg-rose-500/15", text: "text-rose-600", border: "border-rose-500/30" },
  { bg: "bg-blue-500", bgLight: "bg-blue-500/15", text: "text-blue-600", border: "border-blue-500/30" },
  { bg: "bg-orange-500", bgLight: "bg-orange-500/15", text: "text-orange-600", border: "border-orange-500/30" },
  { bg: "bg-pink-500", bgLight: "bg-pink-500/15", text: "text-pink-600", border: "border-pink-500/30" },
  { bg: "bg-teal-500", bgLight: "bg-teal-500/15", text: "text-teal-600", border: "border-teal-500/30" },
  { bg: "bg-indigo-500", bgLight: "bg-indigo-500/15", text: "text-indigo-600", border: "border-indigo-500/30" },
];

/* ── Main component (uses URL params for steps) ──────────── */
const TemplateDirectory = () => {
  const { categoryId, typeId } = useParams();
  const isDesktop = useIsElectron();

  // Determine current step and render appropriate view
  let content;
  if (typeId && categoryId) {
    content = <TypeDetailView categoryId={categoryId} typeId={typeId} isDesktop={isDesktop} />;
  } else if (categoryId) {
    content = <CategoryDetailView categoryId={categoryId} isDesktop={isDesktop} />;
  } else {
    content = <CategoriesHomeView isDesktop={isDesktop} />;
  }

  return (
    <ElectronPageWrapper>
      {content}
    </ElectronPageWrapper>
  );
};

/* ── Layout type ─────────────────────────────────────────── */
type LayoutVariant = "A" | "B";

/* ═══════════════════════════════════════════════════════════
   Step 1: Categories Home
   ═══════════════════════════════════════════════════════════ */
function CategoriesHomeView({ isDesktop }: { isDesktop: boolean }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [layoutVariant, setLayoutVariant] = useState<LayoutVariant>("A");
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const { templates, categories, isLoading, error } = useTemplates();

  // Extract unique departments from templates (dynamic, not hardcoded)
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    templates.forEach((t) => {
      if (t.department) deptSet.add(t.department);
    });
    return Array.from(deptSet).sort();
  }, [templates]);

  // Filter templates by department
  const filteredTemplates = useMemo(() => {
    if (!selectedDepartment) return templates;
    return templates.filter((t) => t.department === selectedDepartment);
  }, [templates, selectedDepartment]);

  // Build filtered categories from filtered templates
  const filteredCategories = useMemo(() => {
    if (!selectedDepartment) return categories;

    // Group filtered templates by category
    const categoryMap = new Map<string, Template[]>();
    filteredTemplates.forEach((t) => {
      const cat = t.category || "Other";
      if (!categoryMap.has(cat)) categoryMap.set(cat, []);
      categoryMap.get(cat)!.push(t);
    });

    // Match with original categories to preserve metadata
    return categories
      .filter((c) => categoryMap.has(c.title))
      .map((c) => ({
        ...c,
        templates: categoryMap.get(c.title) || [],
        typeCount: categoryMap.get(c.title)?.length || 0,
        questionCount: (categoryMap.get(c.title) || []).reduce((sum, t) => sum + t.questions.length, 0),
      }));
  }, [categories, filteredTemplates, selectedDepartment]);

  // Search results - search across title, scenario, category, subcategory (with department filter)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    // Search categories (from filtered)
    const matchedCategories = filteredCategories.filter(
      (c) => c.title.toLowerCase().includes(q)
    );

    // Search templates (from filtered)
    const matchedTemplates = filteredTemplates
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.scenario?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.subcategory?.toLowerCase().includes(q)
      )
      .map((t) => {
        const category = filteredCategories.find((c) =>
          c.templates.some((ct) => ct.id === t.id)
        );
        return { template: t, category };
      });

    // Also include categories that have matching templates
    const categoriesWithMatchingTemplates = filteredCategories.filter(
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
  }, [searchQuery, filteredTemplates, filteredCategories]);

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-background ${isDesktop ? 'electron-page' : ''}`}>
        {!isDesktop && <Header />}
        <main className={`${isDesktop ? 'pt-6' : 'pt-24'} pb-16`}>
          <div className="section-container flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-sm">Loading templates...</p>
          </div>
        </main>
        {!isDesktop && <Footer />}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-background ${isDesktop ? 'electron-page' : ''}`}>
        {!isDesktop && <Header />}
        <main className={`${isDesktop ? 'pt-6' : 'pt-24'} pb-16`}>
          <div className="section-container text-center py-20">
            <p className="text-destructive text-sm mb-4">Failed to load templates</p>
            <p className="text-muted-foreground text-xs">{error.message}</p>
          </div>
        </main>
        {!isDesktop && <Footer />}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isDesktop ? 'electron-page' : ''}`}>
      {!isDesktop && <Header />}
      <main className={`${isDesktop ? 'pt-6' : 'pt-24'} pb-16`}>
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">Template Directory</h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Browse {filteredCategories.length} categories and {filteredTemplates.length} interview templates.
              Find the right starting point, then customize with AI.
            </p>
          </motion.div>

          {/* Controls: Search + Department Filter + Layout Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            {/* Search bar */}
            <div className="max-w-xl mx-auto mb-4">
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
            </div>

            {/* Filter + Layout Toggle Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Department Filter */}
              {departments.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/60 text-sm font-medium text-foreground hover:border-border transition-colors"
                  >
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedDepartment || "All Departments"}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDeptDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isDeptDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-card border border-border/60 rounded-xl shadow-lg z-50 overflow-hidden"
                      >
                        <div className="py-1 max-h-64 overflow-y-auto">
                          <button
                            onClick={() => { setSelectedDepartment(null); setIsDeptDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${!selectedDepartment ? "bg-primary/5 text-primary font-medium" : "text-foreground"}`}
                          >
                            All Departments
                          </button>
                          {departments.map((dept) => (
                            <button
                              key={dept}
                              onClick={() => { setSelectedDepartment(dept); setIsDeptDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${selectedDepartment === dept ? "bg-primary/5 text-primary font-medium" : "text-foreground"}`}
                            >
                              {dept}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Layout Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/40">
                <button
                  onClick={() => setLayoutVariant("A")}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    layoutVariant === "A" ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
                  }`}
                >
                  {layoutVariant === "A" && (
                    <motion.div
                      layoutId="layout-pill"
                      className="absolute inset-0 rounded-lg bg-card border border-border/50 shadow-sm"
                      transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
                    />
                  )}
                  <LayoutGrid className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setLayoutVariant("B")}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    layoutVariant === "B" ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
                  }`}
                >
                  {layoutVariant === "B" && (
                    <motion.div
                      layoutId="layout-pill"
                      className="absolute inset-0 rounded-lg bg-card border border-border/50 shadow-sm"
                      transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
                    />
                  )}
                  <Layers className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">Visual</span>
                </button>
              </div>
            </div>

            {/* Department Filter Chips */}
            {departments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap items-center justify-center gap-2 mt-4"
              >
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    !selectedDepartment
                      ? "bg-foreground text-background shadow-sm border-transparent"
                      : "bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {departments.map((dept, index) => {
                  const colors = DEPT_CHIP_COLORS[index % DEPT_CHIP_COLORS.length];
                  const isSelected = selectedDepartment === dept;
                  return (
                    <button
                      key={dept}
                      onClick={() => setSelectedDepartment(isSelected ? null : dept)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                        isSelected
                          ? `${colors.bg} text-white shadow-sm border-transparent`
                          : `${colors.bgLight} ${colors.text} ${colors.border} hover:opacity-80`
                      }`}
                    >
                      {dept}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </motion.div>

          {/* Click outside to close dropdown */}
          {isDeptDropdownOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDeptDropdownOpen(false)}
            />
          )}

          <AnimatePresence mode="wait">
            {searchResults ? (
              <motion.div key="search" {...pageVariants}>
                {/* Search results */}
                {searchResults.categories.length === 0 && searchResults.templates.length === 0 && (
                  <div className="text-center py-20">
                    <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">No results for "{searchQuery}"</p>
                    {selectedDepartment && (
                      <p className="text-muted-foreground/60 text-xs mt-1">in {selectedDepartment} department</p>
                    )}
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
              <motion.div key={`categories-${layoutVariant}`} variants={staggerContainer} initial="initial" animate="animate">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-20">
                    <Sparkles className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">
                      {selectedDepartment
                        ? `No templates found in ${selectedDepartment} department`
                        : "No templates available yet"
                      }
                    </p>
                  </div>
                ) : layoutVariant === "A" ? (
                  <LayoutA categories={filteredCategories} navigate={navigate} />
                ) : (
                  <LayoutB categories={filteredCategories} templates={filteredTemplates} navigate={navigate} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      {!isDesktop && <Footer />}
    </div>
  );
}

/* ── Layout A: Structured Grid ─────────────────────────────── */
function LayoutA({ categories, navigate }: { categories: TemplateCategory[]; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <motion.div key={cat.id} variants={staggerItem}>
          <CategoryCard category={cat} onClick={() => navigate(`/templates/${cat.id}`)} />
        </motion.div>
      ))}
    </div>
  );
}

/* ── Layout B: Visual/Expressive ───────────────────────────── */
function LayoutB({ categories, templates, navigate }: { categories: TemplateCategory[]; templates: Template[]; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="space-y-12">
      {categories.map((category, catIndex) => (
        <motion.div
          key={category.id}
          variants={staggerItem}
          className="relative"
        >
          {/* Category Header with strong color accent */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
              }}
            >
              <span className="drop-shadow-sm">{category.emoji}</span>
            </div>
            <div className="flex-1">
              <button
                onClick={() => navigate(`/templates/${category.id}`)}
                className="group"
              >
                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {category.title}
                </h2>
              </button>
              <p className="text-sm text-muted-foreground">
                {category.typeCount} templates · {category.questionCount} questions
              </p>
            </div>
            <button
              onClick={() => navigate(`/templates/${category.id}`)}
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Template cards with color accents */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {category.templates.slice(0, 6).map((template, i) => (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => navigate(`/templates/${category.id}/${template.id}`)}
                className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${template.color || category.color}10 0%, ${template.color || category.color}05 50%, transparent 100%)`,
                  borderWidth: 1,
                  borderColor: `${template.color || category.color}30`,
                }}
              >
                {/* Decorative corner accent */}
                <div
                  className="absolute top-0 right-0 w-20 h-20 opacity-20 blur-2xl"
                  style={{ background: template.color || category.color }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{template.emoji || "📋"}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {template.title}
                      </h3>
                      {template.subcategory && (
                        <span
                          className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${template.color || category.color}15`,
                            color: template.color || category.color,
                          }}
                        >
                          {template.subcategory}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                    {template.scenario}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground/70">
                      {template.questions.length} questions
                    </span>
                    <span
                      className="text-xs font-medium transition-colors"
                      style={{ color: template.color || category.color }}
                    >
                      Use template →
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Show more if there are more than 6 templates */}
          {category.templates.length > 6 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate(`/templates/${category.id}`)}
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                +{category.templates.length - 6} more templates
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Divider between categories (except last) */}
          {catIndex < categories.length - 1 && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-px bg-border/50" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ── Category Card ───────────────────────────────────────── */
function CategoryCard({ category, onClick }: { category: TemplateCategory; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-full text-left glass-card rounded-2xl p-5 hover:shadow-md hover:scale-[1.01] transition-all duration-200 group"
    >
      <div className="flex items-start gap-3.5 h-full">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
          style={getCategoryAccentStyle(category.color)}
        >
          {category.emoji}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{category.title}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {category.templates[0]?.scenario || `${category.typeCount} interview types available`}
          </p>
          <div className="flex items-center gap-3 mt-auto pt-2">
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
function CategoryDetailView({ categoryId, isDesktop }: { categoryId: string; isDesktop: boolean }) {
  const navigate = useNavigate();
  const { findCategoryById, isLoading, error } = useTemplates();
  const category = findCategoryById(categoryId);

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-background ${isDesktop ? 'electron-page' : ''}`}>
        {!isDesktop && <Header />}
        <main className={`${isDesktop ? 'pt-6' : 'pt-24'} pb-16`}>
          <div className="section-container flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        </main>
        {!isDesktop && <Footer />}
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className={`min-h-screen bg-background ${isDesktop ? 'electron-page' : ''}`}>
        {!isDesktop && <Header />}
        <main className={`${isDesktop ? 'pt-6' : 'pt-24'} pb-16 text-center`}>
          <p className="text-muted-foreground">Category not found.</p>
          <button onClick={() => navigate("/templates")} className="text-primary text-sm mt-4 hover:underline">← Back to directory</button>
        </main>
        {!isDesktop && <Footer />}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isDesktop ? 'electron-page' : ''}`}>
      {!isDesktop && <Header />}
      <main className={`${isDesktop ? 'pt-6' : 'pt-24'} pb-16`}>
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
      {!isDesktop && <Footer />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Step 3: Interview Type Detail (questions)
   ═══════════════════════════════════════════════════════════ */
function TypeDetailView({ categoryId, typeId, isDesktop }: { categoryId: string; typeId: string; isDesktop: boolean }) {
  const navigate = useNavigate();
  const { findCategoryById, findTemplateById, isLoading, error } = useTemplates();
  const category = findCategoryById(categoryId);
  const template = findTemplateById(typeId);

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-background ${isDesktop ? 'electron-page' : ''}`}>
        {!isDesktop && <Header />}
        <main className={`${isDesktop ? 'pt-6' : 'pt-24'} pb-16`}>
          <div className="section-container flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        </main>
        {!isDesktop && <Footer />}
      </div>
    );
  }

  if (error || !category || !template) {
    return (
      <div className={`min-h-screen bg-background ${isDesktop ? 'electron-page' : ''}`}>
        {!isDesktop && <Header />}
        <main className={`${isDesktop ? 'pt-6' : 'pt-24'} pb-16 text-center`}>
          <p className="text-muted-foreground">Interview type not found.</p>
          <button onClick={() => navigate("/templates")} className="text-primary text-sm mt-4 hover:underline">← Back to directory</button>
        </main>
        {!isDesktop && <Footer />}
      </div>
    );
  }

  // Sort questions by order
  const sortedQuestions = [...template.questions].sort((a, b) => a.order - b.order);

  return (
    <div className={`min-h-screen bg-background ${isDesktop ? 'electron-page' : ''}`}>
      {!isDesktop && <Header />}
      <main className={`${isDesktop ? 'pt-6' : 'pt-24'} pb-16`}>
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
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{template.title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{template.scenario}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary" className="rounded-full text-[11px]">{sortedQuestions.length} questions</Badge>
                    {template.subcategory && (
                      <Badge variant="secondary" className="rounded-full text-[11px]">{template.subcategory}</Badge>
                    )}
                  </div>
                </div>
                <PrimaryButton
                  className="hidden sm:flex flex-shrink-0 gap-2 mt-1"
                  onClick={() => navigate(`/create-interview?templateId=${typeId}`)}
                >
                  <Sparkles className="w-4 h-4" />
                  Start with This Template
                </PrimaryButton>
              </div>
              <PrimaryButton
                className="sm:hidden w-full gap-2 mt-4"
                onClick={() => navigate(`/create-interview?templateId=${typeId}`)}
              >
                <Sparkles className="w-4 h-4" />
                Start with This Template
              </PrimaryButton>
            </div>

            {/* Questions list */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
              {sortedQuestions.map((question, i) => (
                <QuestionRow key={question.id} questionText={question.text} index={i} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>
      {!isDesktop && <Footer />}
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
