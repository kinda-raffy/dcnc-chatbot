'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { fetcher } from '@/lib/utils';
import type { KnowledgeUnit } from '@/lib/db/schema';
import { PlusIcon } from './icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { extractPdfText } from '@/lib/actions/pdf';
import { useSession } from 'next-auth/react';
import { toast } from './toast';
import Image from 'next/image';

export function KnowledgeBase() {
  const { data: knowledgeUnits } = useSWR<Array<KnowledgeUnit>>(
    '/api/knowledge-base',
    fetcher,
  );

  return (
    <div className="flex flex-col gap-4 px-60 pt-10">
      <span className="text-2xl font-semibold px-2">Global Knowledge Base</span>
      <KnowledgeUnitList knowledgeUnits={knowledgeUnits ?? []} />
    </div>
  );
}

function KnowledgeUnitList({
  knowledgeUnits,
}: { knowledgeUnits: Array<KnowledgeUnit> }) {
  const { data: session } = useSession();
  const isGuest = !session?.user || session.user.type === 'guest';

  return (
    <div className="flex flex-row flex-wrap gap-4">
      <KnowledgeCreateUnit disabled={isGuest} />
      {knowledgeUnits.map((unit) => (
        <KnowledgeUnitCard
          key={unit.id}
          label={unit.label}
          text={unit.text}
          userId={unit.userId}
        />
      ))}
    </div>
  );
}

function KnowledgeCreateUnit({ disabled }: { disabled: boolean }) {
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const resetState = (): void => {
    setExtractedText('');
    setIsProcessing(false);
    setUploadMessage('');
    setLabel('');
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      event.target.value = '';
      alert('Please upload a PDF file.');
      return;
    }

    setIsProcessing(true);
    setUploadMessage('Processing PDF, please wait...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await extractPdfText(formData);

      if ('error' in result) {
        throw new Error(result.error);
      }

      setExtractedText(result.text);
      setUploadMessage('');
    } catch (error) {
      console.error('Error:', error);
      setUploadMessage(
        error instanceof Error ? error.message : 'Failed to process PDF.',
      );
      setExtractedText('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!label.trim()) {
      toast({
        type: 'error',
        description: 'Please enter a label for the knowledge unit.',
      });
      return;
    }

    if (!extractedText) {
      toast({
        type: 'error',
        description: 'Please upload and process a PDF file first.',
      });
      return;
    }

    try {
      const response = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label,
          text: extractedText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save knowledge unit.');
      }

      toast({
        type: 'success',
        description: 'Knowledge unit saved successfully.',
      });

      resetState();
      setIsOpen(false);
    } catch (error) {
      toast({
        type: 'error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to save knowledge unit.',
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetState();
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className={`w-[450px] h-[250px] border border-sidebar-border bg-sidebar-background text-sidebar-foreground/50 rounded-md flex items-center justify-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-sidebar-foreground/10'}`}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
              toast({
                type: 'error',
                description: 'Please sign in to create knowledge units.',
              });
            }
          }}
        >
          <PlusIcon size={36} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Add a new knowledge unit</DialogTitle>
            <DialogDescription>
              Knowledge units are shared pieces of context that can be used to
              quickly inject context into a chat.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              name="label"
              placeholder="Enter a label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="file">PDF File</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="cursor-pointer file:cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Max 200mb. Large files may cause the server to timeout.
            </p>
          </div>

          {isProcessing ? (
            <p className="text-sm text-muted-foreground">{uploadMessage}</p>
          ) : (
            <>
              {uploadMessage && (
                <p className="text-sm text-muted-foreground">{uploadMessage}</p>
              )}
              {extractedText && (
                <div className="grid gap-2">
                  <Label>OCR Extracted Text Preview</Label>
                  <div className="max-h-[200px] overflow-y-auto rounded-md border border-input bg-background p-3 text-sm">
                    {extractedText}
                  </div>
                </div>
              )}
            </>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!extractedText || !label.trim()}>
              Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function KnowledgeUnitCard({
  label,
  text,
  userId,
}: {
  label: string;
  text: string;
  userId: string;
}) {
  const { data: user } = useSWR<{ email: string }>(
    `/api/user/${userId}`,
    fetcher,
  );

  console.log(user);

  return (
    <div className="w-[450px] h-[250px] border border-sidebar-border bg-sidebar-background rounded-md p-4 flex flex-col gap-2">
      <span className="text-lg font-semibold truncate">{label}</span>
      <div className="flex-1 overflow-y-auto rounded-md border border-input bg-background p-2 text-sm">
        {text}
      </div>
      <div className="flex flex-row items-center gap-1">
        <Image
          src={`https://avatar.vercel.sh/${user?.email ?? userId}`}
          alt={`User Avatar for ${user?.email ?? userId}`}
          width={12}
          height={12}
          className="rounded-full"
        />
        <span className="text-xs truncate">{user?.email ?? userId}</span>
      </div>
    </div>
  );
}
