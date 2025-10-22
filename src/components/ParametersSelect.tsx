import { Button } from "@/components/ui/button";
import { DecimalInput } from "@/components/ui/decimal-input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Parameters {
  margin: number;
  confidence: number;
  response_distribution: number;
}

interface ParameterSelectProps {
  selectedParams: Parameters;
  onParamsSelect: (params: Parameters) => void;
  handleUploaded: () => Promise<void>;
  selectedFile: File | null;
  disabled: boolean;
}

export const ParameterSelect = ({
  selectedParams,
  onParamsSelect,
  handleUploaded,
  selectedFile,
  disabled,
}: ParameterSelectProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const requiredKeys = ["confidence", "margin", "response_distribution"];
  const hasAllValidParams = requiredKeys.every(
    (key) => {
      console.log(selectedParams[key])
      return Number.isFinite(selectedParams[key]) && selectedParams[key] >= 0
    }
  );



  const handleChange = (key: keyof Parameters, value: number) => {
    onParamsSelect({
      ...selectedParams,
      [key]: value ?? NaN,
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      await handleUploaded();
      toast.success("Upload successful!");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* --- Parameter Inputs --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="margin">Margin</Label>
          <DecimalInput
            value={selectedParams.margin}
            onChange={(e) => handleChange("margin", Number(e))}
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="confidence">Confidence</Label>
           <DecimalInput
            value={selectedParams.confidence}
            onChange={(e) => handleChange("confidence", Number(e))}
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="response_distribution">Distribution</Label>
           <DecimalInput
            value={selectedParams.response_distribution}
            onChange={(e) => handleChange("response_distribution", Number(e))}
            disabled={disabled}
          />
        </div>
      </div>

      {/* --- Upload Button --- */}
      <Button
        onClick={handleUpload}
        disabled={!hasAllValidParams }
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
            Upload & Process
          </>
        )}
      </Button>
    </div>
  );
};
