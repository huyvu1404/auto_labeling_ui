import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TaskMonitoring } from "@/components/TaskMonitoring";      

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;
export interface Task {
  task_id: string;
  file_name: string;
  category: string;
  status: string;
  creation_time?: string;
  duration?: number;
  full_name: string;
}
interface Parameters {
  margin: number;
  confidence: number;
  response_distribution: number;
}

const Monitoring = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedParams, setSelectedParams] = useState({
      margin: 0.05,
      confidence: 0.95,
      response_distribution: 0.5,
    });
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDownloading, setIsDownloading] = useState< string | null>(null);
  const [isSampling, setIsSampling] = useState< string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // loading cho lần đầu vào trang

  
  const handleSample = async (task_id: string, params: Parameters ) => {
    try {
      setIsSampling(task_id);
      const token = localStorage.getItem("token")
      const formData = new FormData();
      formData.append("task_id", task_id);
      formData.append("params", JSON.stringify(params))
      const sampleResponse = await fetch(`${BACKEND_ENDPOINT}/api/tasks/download-sampling`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
        },
        body: formData
      });
      const sampleBlob = await sampleResponse.blob();
      const url = window.URL.createObjectURL(sampleBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sampled_${task_id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error)
      alert("An error occurred during sampling.");
    } finally {
      setIsSampling(null);
    }
  };

  const handleDownload = async (task_id: string) => {
    try {
      setIsDownloading(task_id);
      const token = localStorage.getItem("token")
      const response = await fetch(`${BACKEND_ENDPOINT}/api/tasks/file/${task_id}`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        alert("Download failed: " + response.statusText);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `task_${task_id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("An error occurred during download.");
    } finally {
      setIsDownloading(null);
    }
  };

  const fetchTasks = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);               
        setIsInitialLoading(false);      
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_ENDPOINT}/api/tasks`, { 
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,         
        } 
      });
      const data = await response.json();
      setTasks(data);

    } catch (error) {
      alert("Error occured")
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = tasks;
    if (date) {
      const d = date.toDateString();
      result = result.filter((t) => new Date(t.creation_time!).toDateString() === d);
    }
    if (statusFilter !== "all") {
      result = result.filter(
        (t) => t.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.task_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.file_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredTasks(result);
  }, [tasks, date, statusFilter, searchTerm]);

  useEffect(() => {
    fetchTasks(true);
    const intervalId = setInterval(() => {
      fetchTasks(false);
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor and manage your AI processing tasks with advanced filtering options.
          </p>
        </div>
        <Button
          className="gap-2 rounded-lg"
          onClick={() => fetchTasks(true)}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>Filter tasks by date, status, and search terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-lg",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    modifiersClassNames={{
                      today: date ? "bg-white-100" : "bg-accent text-white", // chỉ tô màu hôm nay khi chưa chọn ngày
                      selected: "bg-accent text-white",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 rounded-lg"
                />
              </div>
            </div>


          </div>
        </CardContent>
      </Card>
      <TaskMonitoring 
      tasks={filteredTasks} 
      isLoading={isLoading} 
      handleDownload={handleDownload} 
      isDownloading={isDownloading} 
      handleSample={handleSample}
      isSampling={isSampling}
      params={selectedParams}
      onParamsChange={
        (key, value) =>
         setSelectedParams((prev) => ({ ...prev, [key]: value }))
         } />
    </div>
  );
};

export default Monitoring;
