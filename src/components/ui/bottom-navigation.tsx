import { Home, Dumbbell, History, User, Timer, Settings, MessageCircle, Calendar, StretchHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const baseNavigationItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Dumbbell, label: "Treino", path: "/workout" },
  { icon: Calendar, label: "Agenda", path: "/schedule" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: StretchHorizontal, label: "Mobilidade", path: "/mobility" },
  { icon: Timer, label: "Cronômetros", path: "/timers" },
  { icon: History, label: "Histórico", path: "/history" },
  { icon: User, label: "Perfil", path: "/profile" },
];

export function BottomNavigation() {
  const { isAdminUser } = useAdminAuth();
  // Always show Perfil; append Admin when user email matches admin or configured override
  const navigationItems = isAdminUser
    ? [...baseNavigationItems, { icon: Settings, label: "Admin", path: "/admin" }]
    : baseNavigationItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-spotify-card border-t border-border backdrop-blur-lg z-50 safe-bottom">
      <div className="app-container py-2 px-2 grid grid-cols-5 gap-1 items-center justify-items-center md:flex md:items-center md:justify-around md:px-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center py-1 px-2 md:py-2 md:px-3 rounded-lg transition-all duration-300",
                "hover:bg-spotify-surface",
                isActive
                  ? "text-spotify-green scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 mb-0.5 md:mb-1" />
            <span className="text-[10px] md:text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}