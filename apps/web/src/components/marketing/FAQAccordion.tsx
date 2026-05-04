'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { allFAQs, type FAQItem } from '@/lib/faq-data';

export type { FAQItem };

interface FAQAccordionProps {
  items?: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items = allFAQs, className }: FAQAccordionProps) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className={cn('flex flex-col divide-y divide-border', className)}
    >
      {items.map((faq, i) => (
        <Accordion.Item
          key={i}
          value={`item-${i}`}
          className="group py-1"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold text-foreground hover:text-brand-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-sm">
              <span>{faq.q}</span>
              <ChevronDown
                size={18}
                className="shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <p className="pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
