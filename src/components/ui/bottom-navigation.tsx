import { Home, Dumbbell, History, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Dumbbell, label: "Treino", path: "/workout" },
  { icon: History, label: "Histórico", path: "/history" },
  { icon: User, label: "Perfil", path: "/profile" },
];

export function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-spotify-card border-t border-border backdrop-blur-lg z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300",
                "hover:bg-spotify-surface",
                isActive
                  ? "text-spotify-green scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}