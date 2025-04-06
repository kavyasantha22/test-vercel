
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Calendar, Settings, FileText, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
  isActive?: boolean;
}

const NavItem = ({ href, icon: Icon, title, isActive }: NavItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 px-2", 
        isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5 text-muted-foreground hover:text-foreground"
      )}
      asChild
    >
      <Link to={href}>
        <Icon size={20} />
        <span>{title}</span>
      </Link>
    </Button>
  );
};

interface SidebarProps {
  currentPath: string;
}

const Sidebar = ({ currentPath }: SidebarProps) => {
  return (
    <div className="h-screen w-64 border-r bg-card flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-strata-700">Strata Manager</h1>
      </div>
      
      <div className="px-2 py-2 flex-1 space-y-1">
        <NavItem 
          href="/" 
          icon={Home} 
          title="Dashboard"
          isActive={currentPath === '/'} 
        />
        <NavItem 
          href="/committee" 
          icon={Users} 
          title="Committee" 
          isActive={currentPath === '/committee'}
        />
        <NavItem 
          href="/meetings" 
          icon={Calendar} 
          title="Meetings" 
          isActive={currentPath === '/meetings'}
        />
        <NavItem 
          href="/documents" 
          icon={FileText} 
          title="Documents" 
          isActive={currentPath === '/documents'}
        />
        <NavItem 
          href="/edge-functions" 
          icon={Server} 
          title="Edge Functions" 
          isActive={currentPath === '/edge-functions'}
        />
        <NavItem 
          href="/settings" 
          icon={Settings} 
          title="Settings" 
          isActive={currentPath === '/settings'}
        />
      </div>
      
      <div className="p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Logged in as <span className="font-medium">Committee Member</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
