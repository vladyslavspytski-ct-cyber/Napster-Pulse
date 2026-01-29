import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Inbox, FolderOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import InterviewResponseCard from "@/components/dashboard/InterviewResponseCard";
import SavedInterviewCard from "@/components/dashboard/SavedInterviewCard";
import {
  mockInterviewResponses,
  mockSavedInterviews,
} from "@/lib/mockDashboardData";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("conducted");
  const [searchQuery, setSearchQuery] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-[800px] mx-auto space-y-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-2"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Your interview inbox and saved interviews
              </p>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-2 mb-6">
                  <TabsTrigger value="conducted" className="gap-2">
                    <Inbox className="w-4 h-4" />
                    <span className="hidden sm:inline">Conducted Interviews</span>
                    <span className="sm:hidden">Conducted</span>
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Saved Interviews</span>
                    <span className="sm:hidden">Saved</span>
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  {/* Tab 1: Conducted Interviews */}
                  <TabsContent value="conducted" className="space-y-4">
                    {/* Search/Filter Bar */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name or email..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Button variant="outline" className="shrink-0" disabled>
                        Filter by status
                      </Button>
                    </motion.div>

                    {/* Interview Responses List */}
                    {mockInterviewResponses.length > 0 ? (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                      >
                        {mockInterviewResponses.map((response, index) => (
                          <InterviewResponseCard
                            key={response.id}
                            response={response}
                            index={index}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <EmptyState type="conducted" />
                    )}
                  </TabsContent>

                  {/* Tab 2: Saved Interviews */}
                  <TabsContent value="saved" className="space-y-4">
                    {/* Action Bar */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-end"
                    >
                      <PrimaryButton size="sm" asChild>
                        <Link to="/create-interview">
                          <Plus className="w-4 h-4 mr-1.5" />
                          Create Interview
                        </Link>
                      </PrimaryButton>
                    </motion.div>

                    {/* Saved Interviews List */}
                    {mockSavedInterviews.length > 0 ? (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                      >
                        {mockSavedInterviews.map((interview, index) => (
                          <SavedInterviewCard
                            key={interview.id}
                            interview={interview}
                            index={index}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <EmptyState type="saved" />
                    )}
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Empty State Component
const EmptyState = ({ type }: { type: "conducted" | "saved" }) => {
  const isConducted = type === "conducted";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        {isConducted ? (
          <Inbox className="w-8 h-8 text-muted-foreground" />
        ) : (
          <FolderOpen className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {isConducted ? "No interviews yet" : "No saved interviews"}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {isConducted
          ? "Once participants complete your interviews, their responses will appear here."
          : "Create your first interview to start collecting voice responses."}
      </p>
      <PrimaryButton asChild>
        <Link to="/create-interview">
          <Plus className="w-4 h-4 mr-1.5" />
          Create an interview
        </Link>
      </PrimaryButton>
    </motion.div>
  );
};

export default Dashboard;
