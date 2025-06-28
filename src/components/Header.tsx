import { BotMessageSquare, Cog } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <BotMessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">LogLens AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-muted-foreground">All Systems Operational</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onSettingsClick} aria-label="Settings">
            <Cog className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
