import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity } from "@/pages/Log";

const Log = ({ activities, isLoading, }: 
    { 
        activities: Activity[]; 
        isLoading: boolean;
    }) => {
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
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Create At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {activities.map((activity) => (
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
        </Card>
    );
};

export { Log };
