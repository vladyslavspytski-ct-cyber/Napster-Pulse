import { useState } from "react";
import { Mic, MicOff, Trash2, Pencil, Copy, Check, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  isEditing: boolean;
}

const CreateInterview = () => {
  const { toast } = useToast();
  const [interviewName, setInterviewName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");

  // Placeholder questions to simulate voice recognition
  const placeholderQuestions = [
    "What inspired you to pursue this career path?",
    "Can you describe a challenging project you've worked on?",
    "How do you handle feedback and criticism?",
    "What are your goals for the next five years?",
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording started",
      description: "Speak clearly to dictate your questions.",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Simulate adding placeholder questions (will be replaced with ElevenLabs SDK)
    const newQuestions = placeholderQuestions.map((text, index) => ({
      id: `q-${Date.now()}-${index}`,
      text,
      isEditing: false,
    }));
    setQuestions((prev) => [...prev, ...newQuestions]);
    toast({
      title: "Recording stopped",
      description: `${placeholderQuestions.length} questions recognized.`,
    });
  };

  const handleAddQuestion = () => {
    if (newQuestionText.trim()) {
      setQuestions((prev) => [
        ...prev,
        {
          id: `q-${Date.now()}`,
          text: newQuestionText.trim(),
          isEditing: false,
        },
      ]);
      setNewQuestionText("");
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast({
      title: "Question deleted",
      description: "The question has been removed.",
    });
  };

  const handleEditQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isEditing: true } : q))
    );
  };

  const handleSaveQuestion = (id: string, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text: newText, isEditing: false } : q))
    );
  };

  const handleGenerateLink = () => {
    // Placeholder link generation (will be replaced with actual logic)
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const link = `https://interu.app/interview/${uniqueId}`;
    setGeneratedLink(link);
    toast({
      title: "Link generated!",
      description: "Your interview link is ready to share.",
    });
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    toast({
      title: "Link copied!",
      description: "The interview link has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCreateAnother = () => {
    setInterviewName("");
    setQuestions([]);
    setGeneratedLink("");
    setIsCopied(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="section-container py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </a>
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Create Interview</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="section-container py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Interview Name Section */}
          <Card className="glass-card border-border/50 animate-fade-up">
            <CardHeader>
              <CardTitle className="text-xl">Interview Name</CardTitle>
              <CardDescription>
                Give your interview a descriptive name (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Product Manager Interview Q1 2024"
                value={interviewName}
                onChange={(e) => setInterviewName(e.target.value)}
                className="bg-background/50"
              />
            </CardContent>
          </Card>

          {/* Voice Input Section */}
          <Card className="glass-card border-border/50 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-xl">Voice Input</CardTitle>
              <CardDescription>
                Dictate your interview questions using voice (ElevenLabs integration coming soon)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className={`btn-gradient gap-2 transition-all duration-300 ${
                    isRecording ? "opacity-50" : "hover:scale-105"
                  }`}
                >
                  <Mic className="h-5 w-5" />
                  Start Recording
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleStopRecording}
                  disabled={!isRecording}
                  className={`gap-2 transition-all duration-300 ${
                    !isRecording ? "opacity-50" : "hover:scale-105 border-destructive text-destructive"
                  }`}
                >
                  <MicOff className="h-5 w-5" />
                  Stop Recording
                </Button>
              </div>
              {isRecording && (
                <div className="flex items-center justify-center gap-2 text-primary animate-pulse">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-ping" />
                  <span className="text-sm font-medium">Recording in progress...</span>
                </div>
              )}

              {/* Manual Question Add */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-3">Or add questions manually:</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your question here..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
                    className="bg-background/50"
                  />
                  <Button onClick={handleAddQuestion} size="icon" className="shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions List Section */}
          {questions.length > 0 && (
            <Card className="glass-card border-border/50 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="text-xl">Interview Questions</CardTitle>
                <CardDescription>
                  {questions.length} question{questions.length !== 1 ? "s" : ""} added
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {questions.map((question, index) => (
                    <li
                      key={question.id}
                      className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/30 transition-all duration-200 hover:shadow-card"
                    >
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                        {index + 1}
                      </span>
                      {question.isEditing ? (
                        <Input
                          defaultValue={question.text}
                          className="flex-1 bg-background"
                          autoFocus
                          onBlur={(e) => handleSaveQuestion(question.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveQuestion(question.id, e.currentTarget.value);
                            }
                          }}
                        />
                      ) : (
                        <p className="flex-1 text-foreground/90">{question.text}</p>
                      )}
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => handleEditQuestion(question.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Generate Link Section */}
          <Card className="glass-card border-border/50 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="text-xl">Generate Interview Link</CardTitle>
              <CardDescription>
                Create a shareable link for participants to access this interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!generatedLink ? (
                <Button
                  onClick={handleGenerateLink}
                  disabled={questions.length === 0}
                  className="w-full btn-gradient"
                  size="lg"
                >
                  Generate Public Link
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={generatedLink}
                      readOnly
                      className="bg-background/50 font-mono text-sm"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Share this link with participants to collect their voice responses.
                  </p>
                </div>
              )}
              {questions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Add at least one question to generate a link.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="outline" size="lg" asChild>
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
            {generatedLink && (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleCreateAnother}
              >
                Create Another Interview
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateInterview;
