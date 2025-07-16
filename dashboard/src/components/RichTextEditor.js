'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { useState } from 'react';


const Toolbar = ({ editor }) => {
  const [, setRefresh] = useState(0);

  if (!editor) return null;

  const active = (name) =>
    editor.isActive(name)
      ? 'bg-black text-white'
      : 'hover:bg-gray-200';

  const handleClick = (fn) => {
    fn();                 // Exécute l'action (toggleBold etc)
    editor.commands.focus(); // Assure le focus
    setRefresh((x) => x + 1); // Force un re-render
  };

  return (
    <div className="flex flex-wrap gap-1 border border-gray-300 rounded-t-lg p-2 text-sm font-medium">
      <button
        type="button"
        className={`p-2 rounded-md ${active('bold')}`}
        onClick={() => handleClick(() => editor.chain().focus().toggleBold().run())}
      >
        <strong>B</strong>
      </button>

      <button
        type="button"
        className={`p-2 rounded-md italic ${active('italic')}`}
        onClick={() => handleClick(() => editor.chain().focus().toggleItalic().run())}
      >
        I
      </button>

      <button
        type="button"
        className={`p-2 rounded-md line-through ${active('strike')}`}
        onClick={() => handleClick(() => editor.chain().focus().toggleStrike().run())}
      >
        S
      </button>

      <button
        type="button"
        className={`p-2 rounded-md ${active('bulletList')}`}
        onClick={() => handleClick(() => editor.chain().focus().toggleBulletList().run())}
      >
        • Puces
      </button>

      <button
        type="button"
        className={`p-2 rounded-md ${active('orderedList')}`}
        onClick={() => handleClick(() => editor.chain().focus().toggleOrderedList().run())}
      >
        1. Numérotée
      </button>
    </div>
  );
};


const RichTextEditor = ({ content = '', onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      BulletList.configure({
        HTMLAttributes: { class: 'list-disc pl-6' },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: 'list-decimal pl-6' },
      }),
      ListItem,
    ],

    content,

    onUpdate({ editor }) {
      if (onChange) {
        onChange(editor.getJSON());
      }
    },

    editorProps: {
      attributes: {
        class:
          'prose max-w-none p-4 min-h-[150px] focus:outline-none ' +
          'border border-t-0 border-gray-300 rounded-b-lg',
      },
    },

    immediatelyRender: false,
  });

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
