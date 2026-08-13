'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// ─── Curated tech/skill icon list ─────────────────────────────
export const SKILL_ICONS: { name: string; label: string }[] = [
  // Languages & Code
  { name: 'Code', label: 'Code' },
  { name: 'Code2', label: 'Code2' },
  { name: 'FileCode', label: 'FileCode' },
  { name: 'FileCode2', label: 'FileCode2' },
  { name: 'Braces', label: 'Braces' },
  { name: 'Terminal', label: 'Terminal' },
  { name: 'Hash', label: 'Hash' },
  { name: 'Binary', label: 'Binary' },
  // Web
  { name: 'Globe', label: 'Globe' },
  { name: 'Globe2', label: 'Globe2' },
  { name: 'Monitor', label: 'Monitor' },
  { name: 'Layout', label: 'Layout' },
  { name: 'LayoutTemplate', label: 'Layout Template' },
  { name: 'AppWindow', label: 'App Window' },
  { name: 'Wind', label: 'Wind (Tailwind)' },
  { name: 'Workflow', label: 'Workflow' },
  // Backend / Infra
  { name: 'Server', label: 'Server' },
  { name: 'ServerCog', label: 'Server Cog' },
  { name: 'Database', label: 'Database' },
  { name: 'HardDrive', label: 'Hard Drive' },
  { name: 'Cloud', label: 'Cloud' },
  { name: 'CloudCog', label: 'Cloud Cog' },
  { name: 'Container', label: 'Container' },
  { name: 'Boxes', label: 'Boxes' },
  { name: 'Package', label: 'Package' },
  { name: 'Package2', label: 'Package2' },
  // DevOps / Tools
  { name: 'GitBranch', label: 'Git Branch' },
  { name: 'GitMerge', label: 'Git Merge' },
  { name: 'GitGraph', label: 'Git Graph' },
  { name: 'Github', label: 'GitHub' },
  { name: 'Gitlab', label: 'GitLab' },
  { name: 'Cpu', label: 'CPU' },
  { name: 'Microchip', label: 'Microchip' },
  { name: 'Settings', label: 'Settings' },
  { name: 'Settings2', label: 'Settings2' },
  { name: 'Wrench', label: 'Wrench' },
  { name: 'Hammer', label: 'Hammer' },
  { name: 'Cog', label: 'Cog' },
  // Network / Security
  { name: 'Network', label: 'Network' },
  { name: 'Wifi', label: 'Wifi' },
  { name: 'Shield', label: 'Shield' },
  { name: 'ShieldCheck', label: 'Shield Check' },
  { name: 'Lock', label: 'Lock' },
  { name: 'Key', label: 'Key' },
  { name: 'Fingerprint', label: 'Fingerprint' },
  // Data & AI
  { name: 'BarChart', label: 'Bar Chart' },
  { name: 'BarChart2', label: 'Bar Chart 2' },
  { name: 'LineChart', label: 'Line Chart' },
  { name: 'PieChart', label: 'Pie Chart' },
  { name: 'Activity', label: 'Activity' },
  { name: 'Brain', label: 'Brain' },
  { name: 'Sparkles', label: 'Sparkles' },
  { name: 'Bot', label: 'Bot' },
  { name: 'Zap', label: 'Zap' },
  // Mobile & Design
  { name: 'Smartphone', label: 'Smartphone' },
  { name: 'Tablet', label: 'Tablet' },
  { name: 'Figma', label: 'Figma' },
  { name: 'Pen', label: 'Pen' },
  { name: 'PenTool', label: 'Pen Tool' },
  { name: 'Palette', label: 'Palette' },
  // General
  { name: 'Briefcase', label: 'Briefcase' },
  { name: 'BriefcaseBusiness', label: 'Business' },
  { name: 'GraduationCap', label: 'Grad Cap' },
  { name: 'Book', label: 'Book' },
  { name: 'BookOpen', label: 'Book Open' },
  { name: 'Layers', label: 'Layers' },
  { name: 'Puzzle', label: 'Puzzle' },
  { name: 'Rocket', label: 'Rocket' },
  { name: 'Star', label: 'Star' },
  { name: 'Trophy', label: 'Trophy' },
  { name: 'Award', label: 'Award' },
  { name: 'Target', label: 'Target' },
  { name: 'Crosshair', label: 'Crosshair' },
  { name: 'LifeBuoy', label: 'Support' },
];

// ─── Dynamic icon renderer ─────────────────────────────────────
export function LucideIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return <LucideIcons.Code className={className} />;
  return <Icon className={className} />;
}

// ─── Icon Picker component ─────────────────────────────────────
export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      SKILL_ICONS.filter(
        (i) =>
          i.label.toLowerCase().includes(search.toLowerCase()) ||
          i.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-none border-primary/20 bg-background/50 hover:bg-primary/5 hover:border-primary/40 justify-between font-mono text-sm h-8 px-3"
        >
          <span className="flex items-center gap-2 text-foreground">
            <LucideIcon name={value} className="h-4 w-4 text-primary shrink-0" />
            {value || 'Pick icon…'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-72 p-0 rounded-none border-primary/30 bg-card font-mono"
        align="start"
        sideOffset={4}
      >
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-primary/20">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search icons…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 border-0 bg-transparent focus-visible:ring-0 text-xs p-0"
            autoFocus
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-6 gap-1 p-2 max-h-56 overflow-y-auto">
          {filtered.map((icon) => {
            const isActive = value === icon.name;
            return (
              <button
                key={icon.name}
                type="button"
                title={icon.label}
                onClick={() => {
                  onChange(icon.name);
                  setOpen(false);
                  setSearch('');
                }}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-none border transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-transparent hover:bg-primary/10 hover:border-primary/30 text-muted-foreground hover:text-primary'
                }`}
              >
                <LucideIcon name={icon.name} className="h-4 w-4" />
                <span className="text-[8px] leading-tight truncate w-full text-center">{icon.label}</span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-6 py-6 text-center text-xs text-muted-foreground">
              No icons found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
