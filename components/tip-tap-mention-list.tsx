'use client';

import React, { useEffect, useImperativeHandle, useState } from 'react';
import { cn } from '@/lib/utils';

type TipTapMentionListProps = {
  ref: React.RefObject<{
    onKeyDown: (event: { event: KeyboardEvent }) => boolean;
  }>;
  items: string[];
  command: (item: { id: string }) => void;
};

export default function TipTapMentionList(props: TipTapMentionListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length,
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(props.ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            type="button"
            key={item}
            onClick={() => selectItem(index)}
            className={cn(
              'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus:bg-accent focus:text-accent-foreground',
              index === selectedIndex && 'bg-accent text-accent-foreground',
            )}
          >
            {item}
          </button>
        ))
      ) : (
        <div className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-muted-foreground">
          No results
        </div>
      )}
    </div>
  );
}
