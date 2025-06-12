import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import TipTapMentionList from './tip-tap-mention-list';
import { MentionOptions } from '@tiptap/extension-mention';

export type MentionSuggestion = MentionOptions['suggestion'];

const fuzzySearch = (str: string, pattern: string): boolean => {
  const lowerPattern = pattern.toLowerCase();
  const lowerStr = str.toLowerCase();
  let patternIdx = 0;

  for (
    let i = 0;
    i < lowerStr.length && patternIdx < lowerPattern.length;
    i++
  ) {
    if (lowerPattern[patternIdx] === lowerStr[i]) {
      patternIdx++;
    }
  }

  return patternIdx === lowerPattern.length;
};

export const getUnitLabelSuggestion: (labels: string[]) => MentionSuggestion = (
  labels,
) => ({
  items: ({ query }) => {
    return labels.filter((item) => fuzzySearch(item, query)).slice(0, 5);
  },

  render: () => {
    let component: any;
    let popup: any;

    return {
      onStart: (props) => {
        component = new ReactRenderer(TipTapMentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        // @ts-expect-error
        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'top-start',
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
});
