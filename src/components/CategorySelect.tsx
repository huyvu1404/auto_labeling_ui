import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  'FMCG', 'Retail', 'Education Services', 'Banking',
  'Digital Payments', 'Insurance', 'Financial Services',
  'Investment Services', 'Real Estate Development', 'Healthcare',
  'Energy & Utilities', 'Software & IT Services',
  'Ride-Hailing & Delivery', 'Logistics & Delivery',
  'Telecommunications & Internet', 'Electronic Products',
  'Food & Beverage', 'Home & Living', 'Hospitality & Leisure',
  'Conglomerates', 'Beauty & Personal Care', 'Automotive',
  'Entertainment & Media', 'Industrial Parks & Zones',
  'Mobile Applications', 'E-commerce'
];

interface CategorySelectProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  handleUploaded: () => Promise<void>;
  selectedFile: File | null;
  disabled: boolean;
}

export const CategorySelect = ({ 
  selectedCategory, 
  onCategorySelect, 
  handleUploaded,
  selectedFile, 
  disabled 
}: CategorySelectProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile || !selectedCategory) {
      toast.error("Please select both file and category");
      return;
    }
    setIsUploading(true);
    try {
      await handleUploaded();
    }
    catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="space-y-4">
      <Select 
        value={selectedCategory} 
        onValueChange={onCategorySelect}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedCategory && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Selected:</span>
          <Badge variant="secondary">{selectedCategory}</Badge>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={disabled || !selectedCategory || isUploading}
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