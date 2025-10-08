import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Monitor,
  Users,
  Upload,
  FileText,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import ChangePasswordModal from "@/components/ChangePassword";
import { useAuth } from "@/hooks/use-auth";

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

const adminNavigationItems = [
  {
    title: "Monitoring",
    url: "/monitoring",
    icon: Monitor,
    description: "Task monitoring with filters",
  },
  {
    title: "User Management",
    url: "/users",
    icon: Users,
    description: "Manage system users",
  },
  {
    title: "File Upload",
    url: "/upload",
    icon: Upload,
    description: "Upload and process files",
  },
  {
    title: "Log",
    url: "/activity",
    icon: FileText,
    description: "User activities",
  }
  
];

// Menu cho user thường
const userNavigationItems = [
  {
    title: "Monitoring",
    url: "/monitoring",
    icon: Monitor,
    description: "Task monitoring with filters",
  },
  {
    title: "File Upload",
    url: "/upload",
    icon: Upload,
    description: "Upload and process files",
  },
  {
    title: "Log",
    url: "/activity",
    icon: FileText,
    description: "Log activities",
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { open } = useSidebar();
  const { user, logout } = useAuth();
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);
  
  const navigate = useNavigate();
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems =
    user?.role === "admin" ? adminNavigationItems : userNavigationItems;
  const handleChangePassword = async ({currentPassword, newPassword, confirmPassword}) => {
    if (newPassword === currentPassword) {
      alert("New password and current password must be different")
      return
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation password do not match!");
      return;
    }
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BACKEND_ENDPOINT}/api/users/change-password`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"    
          },
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword
          })
      })
      if (response.ok) {
        
        alert("Password changed successfully!");
        logout()
      } else {
        const err = await response.json();
        alert(`Failed to change password`);
      }
    } catch (error) {
      alert("An error occurred while changing the password.");
    }
  };
  return (
    <Sidebar
      variant="inset"
      className="border-sidebar-border bg-sidebar-background"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="h-10 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                  >
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {open && (
                        <div className="flex-1 overflow-hidden">
                          <div className="font-medium text-sm text-sidebar-foreground">
                            {item.title}
                          </div>
                          <div className="text-xs text-sidebar-foreground/60 truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* <SidebarGroup> */}
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium">
            User
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 hover:bg-sidebar-accent/50"
                    onClick={() => {
                      logout(); // clear user
                      navigate("/login", { replace: true }); // redirect về login
                    }} >
                  <Users className="h-4 w-4 shrink-0" />
                  {open && (
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium text-sm text-sidebar-foreground">
                        Logout
                      </div>
                      <div className="text-xs text-sidebar-foreground/60 truncate">
                        Logout from the system
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 hover:bg-sidebar-accent/50"
                    onClick={() => {
                      setChangePasswordOpen(true)
                    }} >
                  <Lock className="h-4 w-4 shrink-0" />
                  {open && (
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium text-sm text-sidebar-foreground">
                        Change password
                      </div>
                      <div className="text-xs text-sidebar-foreground/60 truncate">
                        Change password
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        {/* </SidebarGroup> */}
      </SidebarContent>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSubmit={({currentPassword, newPassword, confirmPassword}) => {
          handleChangePassword({currentPassword, newPassword, confirmPassword})
          setChangePasswordOpen(false);
        }}
      />

    </Sidebar>

  );
}

