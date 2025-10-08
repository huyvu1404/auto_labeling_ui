import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
interface ExcelData {
  headers: string[];
  data: any[][];
}
interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onDataParsed: (data: ExcelData | null) => void;
}

export const FileUpload = ({ selectedFile, onFileSelect, onDataParsed }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel") {
        onFileSelect(file);
        parseExcelFile(file);
        toast.success("File selected successfully!");
      } else {
        toast.error("Please select a valid Excel file (.xlsx or .xls)");
        onFileSelect(null);
        onDataParsed(null);
      }
    }
    event.target.value = "";
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[];
          const dataRows = jsonData.slice(1) as any[][];
          onDataParsed({ headers, data: dataRows });
        }
      } catch (error) {
        toast.error("Error parsing Excel file");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        onClick={handleButtonClick}
        variant="outline"
        className="w-full h-32 border-2 border-dashed hover:border-primary"
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium">Click to upload Excel file</span>
          <span className="text-xs text-muted-foreground">Supports .xlsx and .xls files</span>
        </div>
      </Button>

      {selectedFile && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};