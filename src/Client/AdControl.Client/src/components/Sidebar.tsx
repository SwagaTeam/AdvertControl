import { LayoutDashboard, Monitor, Settings, FileText, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Доска", icon: LayoutDashboard },
  { id: "screens", label: "Экраны", icon: Monitor },
  { id: "configurations", label: "Конфигурации", icon: Settings },
  { id: "templates", label: "Шаблоны", icon: FileText },
];

export function Sidebar({ currentPage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-10",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isActive && "bg-blue-50 hover:bg-blue-100",
                  isActive ? "text-blue-700" : "text-gray-700"
                )}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-full"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>
    </aside>
  );
}
