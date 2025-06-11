'use client';
import { Editor, EditorContent, EditorContentProps } from '@tiptap/react';
import React from 'react';

type TipTapTextEditorProps = Omit<EditorContentProps, 'editor'> & {
  editor: Editor | null;
};

export default function TipTapTextEditor(props: TipTapTextEditorProps) {
  if (!props.editor) {
    return null;
  }

  return <EditorContent {...props} />;
}
