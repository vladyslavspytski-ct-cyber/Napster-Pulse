import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Briefcase,
  Rocket,
  Target,
  SearchIcon,
  TrendingUp,
  GraduationCap,
  HeartPulse,
  Scale,
  Newspaper,
  Crown,
  Users,
  DoorOpen,
  X,
  Sparkles,
  Play,
  ChevronRight,
  Hash,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import {
  TEMPLATE_CATEGORIES,
  type Category,
  type DirectoryTemplate,
  type Subcategory,
  getAllTemplates,
} from "@/mock/templatesDirectory";

// Icon mapping by category id
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  hiring: Briefcase,
  onboarding: Rocket,
  performance: Target,
  "product-research": SearchIcon,
  sales: TrendingUp,
  education: GraduationCap,
  medical: HeartPulse,
  legal: Scale,
  journalism: Newspaper,
  leadership: Crown,
  dei: Users,
  exit: DoorOpen,
};

const ACCENT_COLORS: Record<string, string> = {
  hiring: "from-blue-500/15 to-blue-600/5 text-blue-600",
  onboarding: "from-emerald-500/15 to-emerald-600/5 text-emerald-600",
  performance: "from-orange-500/15 to-orange-600/5 text-orange-600",
  "product-research": "from-violet-500/15 to-violet-600/5 text-violet-600",
  sales: "from-rose-500/15 to-rose-600/5 text-rose-600",
  education: "from-cyan-500/15 to-cyan-600/5 text-cyan-600",
  medical: "from-pink-500/15 to-pink-600/5 text-pink-600",
  legal: "from-slate-500/15 to-slate-600/5 text-slate-600",
  journalism: "from-amber-500/15 to-amber-600/5 text-amber-600",
  leadership: "from-yellow-500/15 to-yellow-600/5 text-yellow-600",
  dei: "from-indigo-500/15 to-indigo-600/5 text-indigo-600",
  exit: "from-red-500/15 to-red-600/5 text-red-600",
};

const BATCH_SIZE = 12;

const TemplateDirectory = () => {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<DirectoryTemplate | null>(null);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const allTemplates = useMemo(() => getAllTemplates(), []);

  const selectedCategory = TEMPLATE_CATEGORIES.find((c) => c.id === selectedCategoryId) ?? null;

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let list: DirectoryTemplate[] = [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = allTemplates.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.scenario.toLowerCase().includes(q) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(q)),
      );
    } else if (selectedCategory) {
      const subs = selectedSubcategoryId
        ? selectedCategory.subcategories.filter((s) => s.id === selectedSubcategoryId)
        : selectedCategory.subcategories;
      list = subs.flatMap((s) => s.templates);
    } else {
      list = allTemplates;
    }
    return list;
  }, [searchQuery, selectedCategory, selectedSubcategoryId, allTemplates]);

  const visibleTemplates = filteredTemplates.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTemplates.length;

  // Reset visible count when filters change
  useMemo(() => setVisibleCount(BATCH_SIZE), [searchQuery, selectedCategoryId, selectedSubcategoryId]);

  const handleCategoryClick = (catId: string) => {
    if (selectedCategoryId === catId) {
      setSelectedCategoryId(null);
      setSelectedSubcategoryId(null);
    } else {
      setSelectedCategoryId(catId);
      setSelectedSubcategoryId(null);
    }
    setSearchQuery("");
  };

  const handleSubcategoryClick = (subId: string) => {
    setSelectedSubcategoryId(selectedSubcategoryId === subId ? null : subId);
  };

  const getCategoryTemplateCount = (cat: Category) =>
    cat.subcategories.reduce((sum, s) => sum + s.templates.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="section-container">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
              Template Directory
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Explore {allTemplates.length} interview templates across {TEMPLATE_CATEGORIES.length} categories.
              Find the right starting point, then customize with AI.
            </p>
          </motion.div>

          {/* Global search */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto mb-10"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    setSelectedCategoryId(null);
                    setSelectedSubcategoryId(null);
                  }
                }}
                placeholder="Search templates by title, description, or tag..."
                className="pl-11 h-12 text-sm bg-card border-border/60 rounded-2xl shadow-sm focus-visible:ring-primary/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar — categories */}
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className="lg:sticky lg:top-28">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                  Categories
                </h2>
                <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 custom-scrollbar">
                  {TEMPLATE_CATEGORIES.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.id] ?? Briefcase;
                    const isActive = selectedCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{cat.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground/70">
                          {getCategoryTemplateCount(cat)}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Subcategory chips */}
              <AnimatePresence mode="wait">
                {selectedCategory && !searchQuery && (
                  <motion.div
                    key={selectedCategory.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-wrap gap-2 mb-6"
                  >
                    <Badge
                      variant={selectedSubcategoryId === null ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer rounded-full px-3 py-1 text-xs",
                        selectedSubcategoryId === null && "bg-primary text-primary-foreground",
                      )}
                      onClick={() => setSelectedSubcategoryId(null)}
                    >
                      All
                    </Badge>
                    {selectedCategory.subcategories.map((sub) => (
                      <Badge
                        key={sub.id}
                        variant={selectedSubcategoryId === sub.id ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer rounded-full px-3 py-1 text-xs",
                          selectedSubcategoryId === sub.id && "bg-primary text-primary-foreground",
                        )}
                        onClick={() => handleSubcategoryClick(sub.id)}
                      >
                        {sub.name}
                        <span className="ml-1 opacity-60">{sub.templates.length}</span>
                      </Badge>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? `${filteredTemplates.length} result${filteredTemplates.length !== 1 ? "s" : ""} for "${searchQuery}"`
                    : selectedCategory
                      ? `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? "s" : ""} in ${selectedCategory.name}`
                      : `${filteredTemplates.length} templates`}
                </p>
              </div>

              {/* Empty state */}
              {filteredTemplates.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">No templates found</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">
                    Try a different search or browse categories
                  </p>
                </motion.div>
              )}

              {/* Template grid */}
              {filteredTemplates.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {visibleTemplates.map((template, i) => {
                      // Find parent category for coloring
                      const parentCat = TEMPLATE_CATEGORIES.find((c) =>
                        c.subcategories.some((s) => s.templates.some((t) => t.id === template.id)),
                      );
                      const accent = parentCat ? ACCENT_COLORS[parentCat.id] : ACCENT_COLORS.hiring;
                      const Icon = parentCat ? CATEGORY_ICONS[parentCat.id] ?? Briefcase : Briefcase;

                      return (
                        <motion.button
                          key={template.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(i * 0.02, 0.25) }}
                          onClick={() => setSelectedTemplate(template)}
                          className="w-full text-left glass-card rounded-2xl p-4 hover:shadow-md transition-all duration-200 group"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                                accent,
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {template.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                {template.scenario}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[11px] text-muted-foreground/60">
                                  {template.questionCount} questions
                                </span>
                                {template.tags?.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors mt-1 flex-shrink-0" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {hasMore && (
                    <div className="flex justify-center pt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVisibleCount((v) => v + BATCH_SIZE)}
                        className="rounded-full"
                      >
                        Load more ({filteredTemplates.length - visibleCount} remaining)
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Template detail modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="max-w-lg p-0 rounded-2xl overflow-hidden border-border/50 gap-0">
          {selectedTemplate && (
            <TemplateDetailContent
              template={selectedTemplate}
              onClose={() => setSelectedTemplate(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

function TemplateDetailContent({
  template,
  onClose,
}: {
  template: DirectoryTemplate;
  onClose: () => void;
}) {
  const parentCat = TEMPLATE_CATEGORIES.find((c) =>
    c.subcategories.some((s) => s.templates.some((t) => t.id === template.id)),
  );
  const parentSub = parentCat?.subcategories.find((s) =>
    s.templates.some((t) => t.id === template.id),
  );
  const accent = parentCat ? ACCENT_COLORS[parentCat.id] : ACCENT_COLORS.hiring;
  const Icon = parentCat ? CATEGORY_ICONS[parentCat.id] ?? Briefcase : Briefcase;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-3 mb-4">
          <div
            className={cn(
              "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0",
              accent,
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground">{template.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {parentCat?.name} → {parentSub?.name}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{template.scenario}</p>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {template.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] rounded-full px-2 py-0.5">
                <Hash className="w-2.5 h-2.5 mr-0.5" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Questions preview */}
      <div className="px-6 pb-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Sample Questions ({template.questionCount})
        </h3>
        <ScrollArea className="max-h-48">
          <div className="space-y-2">
            {template.questions.slice(0, 5).map((q, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-muted/40 text-sm"
              >
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-foreground/80 leading-relaxed text-[13px]">{q}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* CTAs */}
      <div className="p-6 pt-2 flex gap-3 border-t border-border/50">
        <PrimaryButton className="flex-1 gap-2" onClick={onClose}>
          <Sparkles className="w-4 h-4" />
          Customize with AI
        </PrimaryButton>
        <Button
          variant="outline"
          className="gap-2 rounded-xl"
          onClick={() => {
            onClose();
            // Navigate to Variant 2 create page with this template
            window.location.href = `/create-interview-from-template?templateId=${template.id}`;
          }}
        >
          <Play className="w-3.5 h-3.5" />
          Use Template
        </Button>
      </div>
    </motion.div>
  );
}

export default TemplateDirectory;
