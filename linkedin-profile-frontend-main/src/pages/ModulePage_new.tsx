import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ModulePage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const handleComplete = () => {
    // Navigate back with state
    navigate("/educational-content", { 
      state: { completedModule: Number(moduleId) }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate("/educational-content")} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Journey
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Module {moduleId} Content</h1>
      
      <div className="prose max-w-none mb-8">
        <p className="text-lg mb-6">
          This is the learning content for Module {moduleId}. After reading through the material,
          click the button below to mark it as complete and continue your journey.
        </p>
        
        {/* Add your module content here */}
        <h2>Module Content</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        
        <h3>Key Points</h3>
        <ul>
          <li>Understanding the fundamentals</li>
          <li>Building on core concepts</li>
          <li>Practical applications</li>
          <li>Next steps in your journey</li>
        </ul>
      </div>

      <Button 
        onClick={handleComplete} 
        size="lg" 
        className="w-full mt-8 bg-primary hover:bg-primary/90"
      >
        Complete Module & Continue Journey
      </Button>
    </div>
  );
};

export default ModulePage;