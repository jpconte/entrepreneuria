"use client";

import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";

const lowlight = createLowlight(common);

type Lesson = { id: string; title: string; content: string; durationMinutes: number };

export function LessonEditor({
  lesson,
  courseId,
  moduleId,
}: {
  lesson: Lesson;
  courseId: string;
  moduleId: string;
}) {
  const [title, setTitle] = useState(lesson.title);
  const [durationMinutes, setDurationMinutes] = useState(lesson.durationMinutes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: lesson.content || "",
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-slate max-w-none min-h-[400px] focus:outline-none p-4",
      },
    },
  });

  const save = useCallback(async () => {
    if (!editor) return;
    setSaving(true);
    setError("");
    const content = editor.getHTML();
    const res = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, durationMinutes }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Error"); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [editor, title, durationMinutes, courseId, moduleId, lesson.id]);

  const ToolbarButton = ({ onClick, active, children, title: t }: { onClick: () => void; active?: boolean; children: React.ReactNode; title?: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={t}
      className={`px-2 py-1 rounded text-sm font-medium transition-colors ${active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la lección"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
            min={0}
            placeholder="Min"
            className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1 text-center">minutos</p>
        </div>
      </div>

      {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</div>}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-slate-800 p-2 flex flex-wrap gap-1 bg-slate-900">
          <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Bold">B</ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Italic"><em>I</em></ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive("strike")} title="Strike"><s>S</s></ToolbarButton>
          <div className="w-px bg-slate-700 mx-1" />
          <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive("heading", { level: 1 })} title="H1">H1</ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} title="H2">H2</ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 })} title="H3">H3</ToolbarButton>
          <div className="w-px bg-slate-700 mx-1" />
          <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Bullet list">• Lista</ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Ordered list">1. Lista</ToolbarButton>
          <div className="w-px bg-slate-700 mx-1" />
          <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="Blockquote">❝</ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleCode().run()} active={editor?.isActive("code")} title="Inline code">{"`code`"}</ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive("codeBlock")} title="Code block">{"```"}</ToolbarButton>
          <div className="w-px bg-slate-700 mx-1" />
          <ToolbarButton
            onClick={() => {
              const url = prompt("URL del enlace:");
              if (url) editor?.chain().focus().setLink({ href: url }).run();
            }}
            active={editor?.isActive("link")}
            title="Link"
          >
            🔗
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const url = prompt("URL de la imagen:");
              if (url) editor?.chain().focus().setImage({ src: url }).run();
            }}
            title="Image"
          >
            🖼️
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Table"
          >
            📊
          </ToolbarButton>
          <div className="w-px bg-slate-700 mx-1" />
          <ToolbarButton onClick={() => editor?.chain().focus().undo().run()} title="Undo">↩</ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().redo().run()} title="Redo">↪</ToolbarButton>
        </div>

        <EditorContent editor={editor} className="min-h-[400px]" />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg text-sm"
        >
          {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar Cambios"}
        </button>
        <p className="text-slate-500 text-xs">Ctrl+Z para deshacer</p>
      </div>
    </div>
  );
}
