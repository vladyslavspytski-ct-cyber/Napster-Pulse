import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Copy,
  Check,
  Trash2,
  GripVertical,
  Loader2,
  Calendar,
  Users,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ElectronPageWrapper from "@/components/electron/ElectronPageWrapper";
import { useIsElectron } from "@/lib/electron";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  useInterviewDetails,
  useUpdateInterview,
  InterviewQuestion,
} from "@/hooks/api/useInterviewDetails";

const InterviewDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isDesktop = useIsElectron();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  // Redirect to home when logged out
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // Fetch interview data
  const { interview, isLoading, error, refetch } = useInterviewDetails(id);
  const { updateInterview, isUpdating } = useUpdateInterview();

  // Form state
  const [introduction, setIntroduction] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  // Initialize form when interview loads
  useEffect(() => {
    if (interview) {
      setIntroduction(interview.introduction || "");
      setQuestions([...interview.questions].sort((a, b) => a.order - b.order));
    }
  }, [interview]);

  // Check for changes
  useEffect(() => {
    if (!interview) return;

    const introChanged = introduction !== (interview.introduction || "");
    const questionsChanged =
      JSON.stringify(questions.map((q) => ({ text: q.text, order: q.order }))) !==
      JSON.stringify(
        [...interview.questions]
          .sort((a, b) => a.order - b.order)
          .map((q) => ({ text: q.text, order: q.order }))
      );

    setHasChanges(introChanged || questionsChanged);
  }, [introduction, questions, interview]);

  const isEditable = interview?.completed_count === 0;
  const editDisabledTooltip = "Editing is not available because this interview already has responses";

  // Copy question to clipboard
  const handleCopyQuestion = useCallback((questionId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionId(questionId);
    toast({
      title: "Question copied",
      description: "Question text copied to clipboard",
    });
    setTimeout(() => setCopiedQuestionId(null), 2000);
  }, [toast]);

  // Update question text
  const handleQuestionChange = useCallback((questionId: string, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, text: newText } : q))
    );
  }, []);

  // Delete question
  const handleDeleteQuestion = useCallback((questionId: string) => {
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.id !== questionId);
      // Reorder remaining questions
      return filtered.map((q, idx) => ({ ...q, order: idx + 1 }));
    });
  }, []);

  // Reorder questions (drag & drop)
  const handleReorder = useCallback((newOrder: InterviewQuestion[]) => {
    // Update order values based on new position
    const reordered = newOrder.map((q, idx) => ({ ...q, order: idx + 1 }));
    setQuestions(reordered);
  }, []);

  // Save changes
  const handleSave = async () => {
    if (!id || !interview) return;

    try {
      await updateInterview(id, {
        introduction,
        questions: questions.map((q) => q.text), // Send only question texts in order
      });

      toast({
        title: "Interview updated successfully",
        description: "Analysis blueprint will be regenerated.",
      });

      setHasChanges(false);
      refetch();
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to update interview",
        description: "Please try again later.",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <ElectronPageWrapper>
        <div className={`min-h-screen flex flex-col bg-background ${isDesktop ? "electron-page" : ""}`}>
          {!isDesktop && <Header />}
          <main className={`flex-1 ${isDesktop ? "pt-6" : "pt-24"} pb-16`}>
            <div className="section-container">
              <div className="text-center py-12">
                <p className="text-destructive">Failed to load interview. Please try again.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/saved-interviews")}>
                  Back to Library
                </Button>
              </div>
            </div>
          </main>
          {!isDesktop && <Footer />}
        </div>
      </ElectronPageWrapper>
    );
  }

  return (
    <ElectronPageWrapper>
      <div className={`min-h-screen flex flex-col bg-background ${isDesktop ? "electron-page" : ""}`}>
        {!isDesktop && <Header />}

        <main className={`flex-1 ${isDesktop ? "pt-6" : "pt-24"} pb-16`}>
          <div className="section-container">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/saved-interviews")}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Library
              </Button>
            </motion.div>

            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-12"
              >
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </motion.div>
            ) : interview ? (
              <>
                {/* Page Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  {/* Badge at top */}
                  <div className="flex justify-center mb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                      <ClipboardList className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        Interview Details
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="text-center mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {interview.title}
                    </h1>
                    {interview.completed_count > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Users className="w-3.5 h-3.5" />
                        Has {interview.completed_count} response{interview.completed_count !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Meta info badges */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border/50">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(interview.created_at)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border/50">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {questions.length} question{questions.length !== 1 ? "s" : ""}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                      interview.is_active
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                        : "bg-muted/50 text-muted-foreground border-border/50"
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {interview.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
                  {/* Left Column: Introduction */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="lg:col-span-5"
                  >
                    <div className="glass-card rounded-2xl p-6 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-base font-semibold text-foreground">Introduction</h2>
                          <p className="text-xs text-muted-foreground">
                            Greeting message for candidates
                          </p>
                        </div>
                      </div>

                      {isEditable ? (
                        <textarea
                          value={introduction}
                          onChange={(e) => setIntroduction(e.target.value)}
                          placeholder="Enter introduction message..."
                          className="w-full h-[200px] px-4 py-3 bg-background/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                        />
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <textarea
                              value={introduction}
                              readOnly
                              className="w-full h-[200px] px-4 py-3 bg-muted/30 border border-border/50 rounded-lg text-sm text-muted-foreground cursor-not-allowed resize-none"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{editDisabledTooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </motion.div>

                  {/* Right Column: Questions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="lg:col-span-7"
                  >
                    <div className="glass-card rounded-2xl p-6 flex flex-col h-[400px] lg:h-[500px]">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                            <MessageSquare className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-base font-semibold text-foreground">Questions</h2>
                            <p className="text-xs text-muted-foreground">
                              {questions.length} question{questions.length !== 1 ? "s" : ""} in this interview
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Questions List */}
                      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
                        <AnimatePresence mode="popLayout">
                          {questions.length === 0 ? (
                            <motion.div
                              key="empty"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col items-center justify-center py-12 text-center"
                            >
                              <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                <MessageSquare className="w-7 h-7 text-muted-foreground/50" />
                              </div>
                              <p className="text-muted-foreground text-sm">No questions found</p>
                            </motion.div>
                          ) : isEditable ? (
                            <Reorder.Group
                              axis="y"
                              values={questions}
                              onReorder={handleReorder}
                              className="space-y-3"
                            >
                              {questions.map((question, index) => (
                                <Reorder.Item
                                  key={question.id}
                                  value={question}
                                  className="cursor-grab active:cursor-grabbing"
                                >
                                  <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="group relative flex gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-border transition-colors"
                                  >
                                    {/* Drag handle */}
                                    <div className="flex-shrink-0 flex items-center text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing">
                                      <GripVertical className="w-5 h-5" />
                                    </div>

                                    {/* Question number */}
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                      {index + 1}
                                    </div>

                                    {/* Question content */}
                                    <div className="flex-1 min-w-0">
                                      <Input
                                        value={question.text}
                                        onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                                        className="w-full bg-background/50 border-border focus:ring-2 focus:ring-primary/50"
                                      />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      {/* Copy button */}
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleCopyQuestion(question.id, question.text)}
                                          >
                                            <motion.div
                                              key={copiedQuestionId === question.id ? "check" : "copy"}
                                              initial={{ scale: 0.8, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ duration: 0.15 }}
                                            >
                                              {copiedQuestionId === question.id ? (
                                                <Check className="w-4 h-4 text-green-500" />
                                              ) : (
                                                <Copy className="w-4 h-4" />
                                              )}
                                            </motion.div>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{copiedQuestionId === question.id ? "Copied!" : "Copy question"}</p>
                                        </TooltipContent>
                                      </Tooltip>

                                      {/* Delete button */}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </motion.div>
                                </Reorder.Item>
                              ))}
                            </Reorder.Group>
                          ) : (
                            <div className="space-y-3">
                              {questions.map((question, index) => (
                                <motion.div
                                  key={question.id}
                                  layout
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="group relative flex gap-3 p-4 rounded-xl bg-muted/30 border border-border/50"
                                >
                                  {/* Question number */}
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                    {index + 1}
                                  </div>

                                  {/* Question content */}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-foreground text-sm py-2 leading-relaxed">{question.text}</p>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    {/* Copy button */}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => handleCopyQuestion(question.id, question.text)}
                                        >
                                          <motion.div
                                            key={copiedQuestionId === question.id ? "check" : "copy"}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.15 }}
                                          >
                                            {copiedQuestionId === question.id ? (
                                              <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                              <Copy className="w-4 h-4" />
                                            )}
                                          </motion.div>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{copiedQuestionId === question.id ? "Copied!" : "Copy question"}</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    {/* Disabled delete button with tooltip */}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="inline-flex">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-30 cursor-not-allowed"
                                            disabled
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{editDisabledTooltip}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Save Button - only show if editable */}
                {isEditable && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex justify-center mt-8"
                  >
                    <PrimaryButton
                      onClick={handleSave}
                      disabled={!hasChanges || isUpdating}
                      className="min-w-[160px]"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </PrimaryButton>
                  </motion.div>
                )}
              </>
            ) : null}
          </div>
        </main>

        {!isDesktop && <Footer />}
      </div>
    </ElectronPageWrapper>
  );
};

export default InterviewDetails;
