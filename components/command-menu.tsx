'use client';
import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { Chat } from '@/lib/db/schema';
import useSWRInfinite from 'swr/infinite';
import { getChatHistoryPaginationKey } from './sidebar-history';
import { fetcher } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: paginatedChatHistories, isLoading } = useSWRInfinite<{
    chats: Chat[];
    hasMore: boolean;
  }>(getChatHistoryPaginationKey, fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === '/') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const chats =
    paginatedChatHistories?.flatMap(
      (paginatedChatHistory) => paginatedChatHistory.chats,
    ) ?? [];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem
            onSelect={() => {
              router.push('/knowledge-base');
              setOpen(false);
            }}
          >
            <GraduationCap />
            Knowledge Base
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="History">
          {isLoading ? (
            <CommandItem disabled>Loading chats...</CommandItem>
          ) : chats.length === 0 ? (
            <CommandItem disabled>No chats found.</CommandItem>
          ) : (
            chats.map((chat) => (
              <CommandItem
                key={chat.id}
                onSelect={() => {
                  router.push(`/chat/${chat.id}`);
                  setOpen(false);
                }}
              >
                <ArrowRight />
                {chat.title}
              </CommandItem>
            ))
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
