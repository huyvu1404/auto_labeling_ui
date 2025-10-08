import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Filter, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Log } from "@/components/Log";      

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

export interface Activity {
    id: number;
    user_name: string;
    action: string;
    description: string;
    created_at: string;
}

const Monitoring = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const fetchActivities = async (showLoading = true) => {
        try {
            if (showLoading) {
                setIsLoading(true);               
                setIsInitialLoading(false);      
            }

            const token = localStorage.getItem("token");
            const response = await fetch(`${BACKEND_ENDPOINT}/api/activities`, { 
                method: "GET",
                headers: { 
                "Authorization": `Bearer ${token}`,         
                } 
            });
            const data = await response.json();
            setActivities(data);

        } catch (error) {
            alert("Error occured")
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        let result = activities;
        if (date) {
            const d = date.toDateString();
            result = result.filter((t) => new Date(t.created_at!).toDateString() === d);
        }

        if (searchTerm) {
            result = result.filter(
                (t) =>
                t.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.action.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredActivities(result);
    }, [activities, date, searchTerm]);

    useEffect(() => {
        fetchActivities(true);
        const intervalId = setInterval(() => {
            fetchActivities(false);
            }, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold text-foreground">User Activity Monitor</h1>
            <p className="text-muted-foreground">
               Monitor and manage all user activities.
            </p>
            </div>
            <Button
            className="gap-2 rounded-lg"
            onClick={() => fetchActivities(true)}
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
            <CardDescription>Filter activities by date, and search terms</CardDescription>
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



                {/* Search */}
                <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Search activites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 rounded-lg"
                    />
                </div>
                </div>


            </div>
            </CardContent>
        </Card>
        <Log 
        activities={filteredActivities} 
        isLoading={isLoading} 
        />
        </div>
    );
};

export default Monitoring;
