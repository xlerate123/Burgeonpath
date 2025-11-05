import { useParams, useNavigate } from "react-router-dom";
import { useProgressStore } from "@/components/state/progress-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ModulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeStep, highestStepCompleted } = useProgressStore();

  const moduleIndex = Math.max(0, Number(id) - 1 || 0);
  
  const handleComplete = () => {
    completeStep(moduleIndex);
    navigate("/educational-content", {
      state: {
        advancedFrom: moduleIndex,
        advancedTo: moduleIndex + 1,
      },
      replace: true,
    });
  };

  const isCompleted = moduleIndex <= highestStepCompleted;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
       <Button variant="ghost" onClick={() => navigate("/educational-content")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Journey
        </Button>
      
      <h1 className="text-3xl font-bold mb-6">Module {id} Content</h1>
      
      <p className="text-lg mb-6">This is the learning content for this module. After reading, click the button below to mark it as complete.</p>

      <Button onClick={handleComplete} size="lg" className="w-full mt-8" disabled={isCompleted}>
        {isCompleted ? "Module Already Completed" : "Mark as Complete & Continue Journey"}
      </Button>
    </div>
  );
};

export default ModulePage;
