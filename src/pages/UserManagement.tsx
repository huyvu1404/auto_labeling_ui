import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  ShieldCheck,
  Crown,
  MoreHorizontal,
  Loader2,
  List
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    user_name: "",
    email: "",
    role: "user"
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
      try {

        setLoading(true);
        const token = localStorage.getItem("token"); 
        const response = await fetch(`${BACKEND_ENDPOINT}/api/users`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Accept": "application/json",     
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        alert("Error occured")
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: {
      [key: string]: {
        variant: "default" | "secondary" | "destructive" | "outline";
        className?: string;
      };
    } = {
      admin: {
        variant: "default",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      user: { variant: "outline" },
    };

    const config = variants[role] || variants.user;
    return (
      <Badge variant={config.variant} className={config.className}>
        <span className="flex items-center gap-1">
          {getRoleIcon(role)}
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      </Badge>
    );
  };

  // const getStatusBadge = (status: string) => {
  //   return (
  //     <Badge
  //       variant={status === "active" ? "default" : "secondary"}
  //       className={
  //         status === "active" ? "bg-green-100 text-green-800 border-green-200" : ""
  //       }
  //     >
  //       {status.charAt(0).toUpperCase() + status.slice(1)}
  //     </Badge>
  //   );
  // };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${BACKEND_ENDPOINT}/api/users/register`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,  
          "Content-Type": "application/json",
          "Accept": "application/json",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Failed to add user");
 
      const addedUser = await response.json();
      setUsers((prev) => [...prev, addedUser]);
      setIsAddUserOpen(false);
      setNewUser({ full_name: "", user_name: "", email: "", role: "user"});
      await fetchUsers();
    } catch (err) {
      alert("Error occured")
    }   
  };

  const handleDeleteUser = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;
  if (id === 1) {
    alert("Can not delete this user")
    return
  }
  try {
    const token = localStorage.getItem("token"); 
    const response = await fetch(`${BACKEND_ENDPOINT}/api/users/${id}`, {
      headers: { 
          "Authorization": `Bearer ${token}`,  
      },
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
    await fetchUsers();
  } catch (err) {
    alert("Delete user failed!");
  }
};

return (
  <div className="space-y-6">
    {/* Header + Add User luôn hiển thị */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">
          Manage system users, roles, and permissions.
        </p>
      </div>
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and assign appropriate permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newUser.full_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, full_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                value={newUser.user_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, user_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    {/* Nội dung chính: Stats + Search + Table */}
    {loading ? (
      <div className="flex flex-col items-center justify-center h-64 space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="text-blue-600">Loading users...</span>
      </div>
    ) : (
      <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.status === "active").length}
              </div>
            </CardContent>
          </Card> */}
          {/* <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.role === "admin").length}
              </div>
            </CardContent>
          </Card> */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.reduce((sum, user) => sum + (user.tasksCompleted || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>
              Find users by name, email, or department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  {filteredUsers.length} users found
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs">
                              {getInitials(user.full_name || user.user_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {new Date(user.last_active).toLocaleString("sv-SE")}
                      </TableCell>
                      <TableCell>
                        {user.total_tasks || 0}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <List className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </>
    )}
  </div>
);
};

export default UserManagement;
