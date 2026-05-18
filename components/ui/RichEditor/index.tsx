'use client'

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';

import styles from './richeditor.module.css';

interface RichEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export default function RichEditor({ content, onChange }: RichEditorProps) {
    const editor = useEditor({
       extensions: [
            StarterKit,
            Heading.configure({ levels: [1, 2, 3] }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.toolbar}>
                <button
                    className={editor.isActive('bold') ? styles.active : ''}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    type="button"
                >B</button>
                <button
                    className={editor.isActive('italic') ? styles.active : ''}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    type="button"
                ><i>I</i></button>
                <span className={styles.separator} />
                <button
                className={editor.isActive('link') ? styles.active : ''}
                onClick={() => {
                    const url = window.prompt('URL del enlace');
                    if (!url) return;
                    editor.chain().focus().setLink({ href: url }).run();
                }}
                type="button"
            >🔗</button>
            <button
                onClick={() => editor.chain().focus().unsetLink().run()}
                type="button"
                disabled={!editor.isActive('link')}
            >✂️</button>
            <span className={styles.separator} />
                <button
                    className={editor.isActive('bulletList') ? styles.active : ''}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    type="button"
                >• Lista</button>
                <button
                    className={editor.isActive('orderedList') ? styles.active : ''}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    type="button"
                >1. Lista</button>
                <span className={styles.separator} />
                {[1, 2, 3].map(level => (
                    <button
                        key={level}
                        className={editor.isActive('heading', { level }) ? styles.active : ''}
                        onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()}
                        type="button"
                    >H{level}</button>
                ))}
                <span className={styles.separator} />
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    type="button"
                >↩</button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    type="button"
                >↪</button>
            </div>
            <EditorContent editor={editor} className={styles.editor} />
        </div>
    );
}