import { useState } from "react";
import {
  Loader2,
  Download,
  Check,
  Clock,
  RefreshCw,
  List,
  FileDown,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DecimalInput } from "./ui/decimal-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/pages/Monitoring";

const getStatusBadge = (status: string) => {
  const statusConfig: { [key: string]: { text: string; bg: string; textColor: string } } = {
    completed: { text: "Completed", bg: "bg-green-500", textColor: "text-white" },
    running: { text: "Running", bg: "bg-yellow-500", textColor: "text-white" },
    pending: { text: "Pending", bg: "bg-gray-300", textColor: "text-gray-800" },
  };

  const config = statusConfig[status.toLowerCase()] || {
    text: status,
    bg: "bg-gray-200",
    textColor: "text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${config.bg} ${config.textColor}`}
    >
      {status === "completed" && <Check className="h-4 w-4" />}
      {status === "running" && <Clock className="h-4 w-4" />}
      {config.text}
    </span>
  );
};

interface Parameters {
  margin: number;
  confidence: number;
  response_distribution: number;
}

interface TaskMonitoringProps {
  tasks: Task[];
  isLoading: boolean;
  handleDownload: (task_id: string) => void;
  isDownloading: string | null;

  // ✅ Sampling
  handleSample: (task_id: string, params: Parameters) => void;
  isSampling: string | null;
  params: Parameters;
  onParamsChange: (key: keyof Parameters, value: number) => void;
}

const TaskMonitoring = ({
  tasks,
  isLoading,
  handleDownload,
  isDownloading,
  handleSample,
  isSampling,
  params,
  onParamsChange,
}: TaskMonitoringProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTasks = tasks.slice(startIndex, startIndex + itemsPerPage);
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading tasks...</span>
      </div>
    );
  }
  
  const requiredKeys = ["confidence", "margin", "response_distribution"];
  const hasAllValidParams = requiredKeys.every(
    (key) => {
      return Number.isFinite(params[key]) && params[key] >= 0
    }
  );
  const resetValues = () => {
    onParamsChange("margin", 0.05);
    onParamsChange("confidence", 0.95);
    onParamsChange("response_distribution", 0.5);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Task List</CardTitle>
          <Badge
            variant="outline"
            className="bg-info/10 text-info border-info/20"
          >
            Live Updates
          </Badge>
        </div>
      </CardHeader>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task ID</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Finish Time</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentTasks.map((task) => (
              <TableRow key={task.task_id}>
                <TableCell className="font-mono text-xs max-w-[150px] break-words">
                  {task.task_id}
                </TableCell>
                <TableCell className="font-mono text-xs max-w-[150px] break-words">
                  {task.file_name}
                </TableCell>
                <TableCell className="font-mono text-xs whitespace-nowrap">
                  {task.category}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {getStatusBadge(task.status.toLowerCase())}
                </TableCell>
                <TableCell className="font-mono text-xs whitespace-nowrap">
                  {task.creation_time
                    ? new Date(task.creation_time).toLocaleString("sv-SE")
                    : "-"}
                </TableCell>
                <TableCell className="font-mono text-xs whitespace-nowrap">
                  {task.duration
                    ? `${task.duration >= 3600 ? Math.floor(task.duration / 3600) + "h " : ""}${
                        Math.floor(task.duration / 60) % 60 > 0
                          ? Math.floor(task.duration / 60) % 60 + "m "
                          : ""
                      }${Math.floor(task.duration % 60)}s`
                    : "-"}
                </TableCell>
                <TableCell className="font-mono text-xs whitespace-nowrap">
                  {task.status?.toLowerCase() === "completed" &&
                  task.creation_time &&
                  !isNaN(task.duration!)
                    ? new Date(
                        new Date(task.creation_time).getTime() +
                          task.duration! * 1000
                      ).toLocaleString("sv-SE")
                    : "-"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {task.full_name}
                </TableCell>

                <TableCell className="text-right">
                  {task.status.toLowerCase() === "completed" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="start">
                        {/* --- Download --- */}
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            handleDownload(task.task_id);
                          }}
                          disabled={isDownloading === task.task_id}
                        >
                          {isDownloading === task.task_id ? (
                            <>
                              <RefreshCw className="mr-2 h-3 w-3 animate-spin" />{" "}
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-3 w-3" /> Download
                            </>
                          )}
                        </DropdownMenuItem>

                        {/* --- Sampling --- */}
                        <DropdownMenuSub  open={isDropdownOpen}
                            onOpenChange={(open) => {
                              if (!open) resetValues(); // chạy khi dropdown đóng
                              setIsDropdownOpen(open);
                            }}>
                          <DropdownMenuSubTrigger>
                            {isSampling === task.task_id ? (
                              <>
                                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />{" "}
                                Sampling...
                              </>
                            ) : (
                              <>
                                <FileDown className="mr-2 h-3 w-3" /> Sampling
                              </>
                            )}
                          </DropdownMenuSubTrigger>

                          <DropdownMenuSubContent 
                          
                            className="p-3 w-56 space-y-2" 
                            >
                            <DecimalInput
                              value={params.margin}
                              onChange={(num) => onParamsChange("margin", num)}
                              placeholder="Margin"
                            />
                            <DecimalInput
                              value={params.confidence}
                              onChange={(num) => onParamsChange("confidence", num)}
                              placeholder="Confidence"
                            />
                            <DecimalInput
                              value={params.response_distribution}
                              onChange={(num) => onParamsChange("response_distribution", num)}
                              placeholder="Response Distribution"
                            />
                            <Button
                              className="w-full"
                              onClick={() =>
                                handleSample(task.task_id, params)
                              }
                              disabled={isSampling === task.task_id || !hasAllValidParams}
                            >
                              {isSampling === task.task_id
                                ? "Processing..."
                                : "Process"}
                            </Button>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {tasks.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export { TaskMonitoring };
