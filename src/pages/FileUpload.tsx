import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload as FileUploadComponent } from "@/components/FileUpload";
import { CategorySelect } from "@/components/CategorySelect";
import { DataPreview } from "@/components/DataPreview";
import { FileSubmit } from "@/components/FileSubmit"
import { useAuth } from "@/hooks/use-auth";
export interface ExcelData {
  headers: string[];
  data: any[][];
}

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [isSampling, setIsSampling] = useState(false);    
  const { user } = useAuth();
  const handleUploaded = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile); 
    formData.append("category", selectedCategory)

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_ENDPOINT}/api/tasks`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`, 
        },
        body: formData
      });
      if (response.ok) {
        alert("File uploaded and processing started!");
      }
    } catch (error) {
        alert("Failed to upload file")
    }
    setSelectedFile(null);
    setSelectedCategory("");
    setExcelData(null);
  };

  const handleSample = async () => {
    try {
      setIsSampling(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      const file_name = selectedFile.name;
      const token = localStorage.getItem("token")
      const sampleResponse = await fetch(`${BACKEND_ENDPOINT}/api/tasks/sampling`, {
        method: "POST",
        body: formData,
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      if (!sampleResponse.ok) {
        alert("Error when generating Excel file");
        return;
      }
      const sampleBlob = await sampleResponse.blob();
      const url = window.URL.createObjectURL(sampleBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `sampled_${file_name}`
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("An error occurred during sampling.");
    } finally {
      setIsSampling(null);
      setSelectedFile(null);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">File Upload & Processing</h1>
        <p className="text-muted-foreground">
          Upload files for AI processing including label classification, spam detection, and sentiment analysis.
        </p>
      </div>

      <Tabs defaultValue="label" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="label">Label Classification</TabsTrigger>
          <TabsTrigger value="sample">Data Sampling</TabsTrigger>
          {/* <TabsTrigger value="spam">Spam Classification</TabsTrigger> */}
        </TabsList>

        <TabsContent value="label" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Excel File</CardTitle>
                <CardDescription>Select an Excel file to upload and process for label classification</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploadComponent
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  onDataParsed={setExcelData}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Category</CardTitle>
                <CardDescription>Choose the appropriate category for your data</CardDescription>
              </CardHeader>
              <CardContent>
                <CategorySelect
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                  selectedFile={selectedFile}
                  handleUploaded={handleUploaded}
                  disabled={!selectedFile}
                />
              </CardContent>
            </Card>
          </div>

          {/* {excelData && (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>Preview your uploaded data before processing</CardDescription>
              </CardHeader>
              <CardContent>
                <DataPreview
                  data={excelData}
                  previewCount={previewCount}
                  onPreviewCountChange={setPreviewCount}
                />
              </CardContent>
            </Card>
          )} */}
        </TabsContent>
          
        <TabsContent value="sample" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Sampling</CardTitle>
              <CardDescription> Sample the data according to the percentage of each sentiment in the original dataset. Use a sample size formula to determine the total number of data points to be sampled. </CardDescription>
            </CardHeader>
            <CardContent>
                <FileUploadComponent
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  onDataParsed={setExcelData}
                />
            </CardContent>
          </Card>
          <Card>
            <FileSubmit
              selectedFile={selectedFile}
              handleSample={handleSample}
              disabled={!selectedFile}
            />
          </Card>
        </TabsContent>

        {/* <TabsContent value="spam" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spam Classification</CardTitle>
              <CardDescription>Upload files to detect spam and ads content using AI classification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Spam classification feature will be available here.</p>
                <p className="text-sm">This will include spam detection and ads classification capabilities.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default FileUpload;