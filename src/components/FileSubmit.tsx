import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface FileSubmitProps {
  handleSample: () => Promise<void>;
  selectedFile: File | null;
  disabled: boolean;
}

export const FileSubmit = ({ 
  handleSample,
  selectedFile, 
  disabled 
}: FileSubmitProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelected = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    setIsUploading(true);
    try {
      await handleSample();
    }
    catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="space-y-4">

      <Button
        onClick={handleFileSelected}
        disabled={disabled || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Process
          </>
        )}
      </Button>
    </div>
  );
};