import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CornerDownLeft, Command, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  category: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
  placeholder?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  placeholder = 'Type a command or search...',
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter commands by query
  const filteredCommands = React.useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lower) ||
        cmd.category.toLowerCase().includes(lower) ||
        (cmd.description && cmd.description.toLowerCase().includes(lower))
    );
  }, [commands, query]);

  // Group filtered commands by category
  const groupedCommands = React.useMemo(() => {
    const groups: { [category: string]: CommandItem[] } = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keybindings listener for navigation and execution
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].onSelect();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-background-secondary)] shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Header */}
        <div className="relative flex items-center border-b border-[var(--color-border-default)] px-4 py-3.5">
          <Search className="h-5 w-5 text-[var(--color-text-tertiary)] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-text-tertiary)] ml-2 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[var(--color-border-default)]"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[var(--color-text-tertiary)]">
                No commands found matching "{query}"
              </p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  {category}
                </div>
                <div className="space-y-0.5">
                  {items.map((cmd) => {
                    const currentIndex = flatIndex++;
                    const isSelected = currentIndex === selectedIndex;
                    const Icon = cmd.icon;

                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        data-active={isSelected}
                        onClick={() => {
                          cmd.onSelect();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                          isSelected
                            ? 'bg-[var(--color-background-elevated)] text-[var(--color-action-primary)] shadow-sm'
                            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)]'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          {Icon && (
                            <div
                              className={cn(
                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors',
                                isSelected
                                  ? 'border-[var(--color-action-primary)]/40 bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)]'
                                  : 'border-[var(--color-border-default)] bg-[var(--color-background-primary)] text-[var(--color-text-secondary)]'
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-medium truncate">{cmd.label}</div>
                            {cmd.description && (
                              <div className="text-xs text-[var(--color-text-tertiary)] truncate">
                                {cmd.description}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {cmd.shortcut && (
                            <span className="font-mono text-[10px] text-[var(--color-text-tertiary)] bg-[var(--color-background-primary)] border border-[var(--color-border-subtle)] px-1.5 py-0.5 rounded">
                              {cmd.shortcut}
                            </span>
                          )}
                          {isSelected && (
                            <CornerDownLeft className="h-3.5 w-3.5 text-[var(--color-action-primary)] animate-pulse" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-4 py-2.5 text-xs text-[var(--color-text-tertiary)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] px-1 py-0.5 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] px-1 py-0.5 font-mono text-[10px]">
                ↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] px-1 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>
              Select
            </span>
          </div>
          <span className="font-mono text-[11px] text-[var(--color-text-tertiary)]">
            Admin Quick Palette
          </span>
        </div>
      </div>
    </div>
  );
};
