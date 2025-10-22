import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity } from "@/pages/Log"; // import kiểu LogEntry tương ứng
import { Button } from "./ui/button";

interface LogProps {
  activities: Activity[];
  isLoading: boolean;
}

const Log = ({ activities, isLoading }: LogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = activities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading activities...</span>
      </div>
    );
  }

  return (
     <Card>
        {/* <CardHeader>
            <div className="flex items-center justify-between">
            <CardTitle>Activity List</CardTitle>
            </div>
        </CardHeader> */}
        <div className="rounded-md border">
            <Table className="w-full table-fixed">
            <TableHeader>
                <TableRow>
                <TableHead className="w-[70px]">User Name</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
                <TableHead className="w-[380px]">Description</TableHead>
                <TableHead className="w-[150px]">Create At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {currentActivities.map((activity) => (
                <TableRow key={activity.id}>
                    <TableCell className="font-mono text-xs break-words max-w-[150px]">
                    {activity.user_name}
                    </TableCell>
                    <TableCell className="font-mono text-xs break-words max-w-[150px]">
                    {activity.action}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs">{activity.description}</TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs">
                    {activity.created_at ? new Date(activity.created_at).toLocaleString("sv-SE") : "-"}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>

      {/* Pagination */}
      {activities.length > 0 && (
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

export { Log };
