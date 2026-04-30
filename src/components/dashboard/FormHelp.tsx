'use client';

import * as React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Phase 6.5 (Apr 27 2026) — inline form help.
 *
 * Pattern adopted from Linear / Monarch / Notion: a small (?) icon next
 * to a form label opens a one-line tooltip explaining a field's
 * meaning, expected format, or how it interacts with another field.
 *
 * Used as:
 *   <label className="flex items-center gap-1">
 *     Nisab method
 *     <FormHelp>How Barakah computes the gold-or-silver threshold below
 *       which Zakat is not due.</FormHelp>
 *   </label>
 *
 * Not for verbose copy — that belongs in the field's `description`
 * line below the input. Help icons answer "what is this?" in one
 * sentence; longer explanations belong in the dedicated /learn pages.
 */

export interface FormHelpProps {
  children: React.ReactNode;
  /** Optional label override for screen readers. Defaults to "Help". */
  ariaLabel?: string;
}

export function FormHelp({ children, ariaLabel = 'Help' }: FormHelpProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={ariaLabel}
            className="inline-flex items-center justify-center w-4 h-4 rounded-full text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          className="max-w-xs text-xs leading-relaxed"
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
