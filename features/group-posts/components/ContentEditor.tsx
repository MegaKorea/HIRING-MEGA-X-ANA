'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type ContentEditorProps = {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

type BlockValue = 'paragraph' | 'h1' | 'h2' | 'h3';

function getBlockValue(editor: Editor): BlockValue {
  if (editor.isActive('heading', { level: 1 })) return 'h1';
  if (editor.isActive('heading', { level: 2 })) return 'h2';
  if (editor.isActive('heading', { level: 3 })) return 'h3';
  return 'paragraph';
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          variant={active ? 'secondary' : 'ghost'}
          disabled={disabled}
          aria-label={label}
          aria-pressed={active}
          onClick={onClick}
          className={cn(active && 'bg-muted text-foreground')}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

export function ContentEditor({
  id,
  value,
  onChange,
  disabled = false,
  placeholder = 'Nhập nội dung bài đăng...',
  className,
}: ContentEditorProps) {
  const skipEmit = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        underline: false,
      }),
      Underline,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    editable: !disabled,
    editorProps: {
      attributes: {
        id: id ?? '',
        class: cn(
          'tiptap min-h-24 break-words px-3 py-2.5 text-sm leading-relaxed outline-none',
          'focus-visible:outline-none text-wrap-anywhere',
          '[&_p]:my-1 [&_h1]:mb-2 [&_h1]:mt-3 [&_h1]:text-xl [&_h1]:font-semibold',
          '[&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-lg [&_h2]:font-semibold',
          '[&_h3]:mb-1.5 [&_h3]:mt-2 [&_h3]:text-base [&_h3]:font-semibold',
          '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5',
          '[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5',
          '[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground',
          '[&_a]:text-primary [&_a]:underline',
          '[&_.is-empty::before]:pointer-events-none [&_.is-empty::before]:float-left [&_.is-empty::before]:h-0 [&_.is-empty::before]:text-muted-foreground [&_.is-empty::before]:content-[attr(data-placeholder)]',
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (skipEmit.current) return;
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || '') !== current) {
      skipEmit.current = true;
      editor.commands.setContent(value || '', { emitUpdate: false });
      skipEmit.current = false;
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          'min-h-24 rounded-2xl border border-transparent bg-input/50',
          className,
        )}
      />
    );
  }

  const blockValue = getBlockValue(editor);

  function setBlock(next: BlockValue) {
    const chain = editor!.chain().focus();
    if (next === 'paragraph') {
      chain.setParagraph().run();
      return;
    }
    const level = next === 'h1' ? 1 : next === 'h2' ? 2 : 3;
    chain.toggleHeading({ level }).run();
  }

  function setLink() {
    const previous = editor!.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL liên kết', previous || 'https://');
    if (url === null) return;
    if (url === '') {
      editor!.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-transparent bg-input/50 transition-[color,box-shadow] duration-200',
        'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 bg-background/60 px-1.5 py-1.5">
        <ToolbarButton
          label="Hoàn tác"
          disabled={disabled || !editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 />
        </ToolbarButton>
        <ToolbarButton
          label="Làm lại"
          disabled={disabled || !editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <Select
          value={blockValue}
          disabled={disabled}
          onValueChange={(next) => setBlock(next as BlockValue)}
        >
          <SelectTrigger
            size="sm"
            className="h-7 w-[7.5rem] bg-background text-xs"
            aria-label="Kiểu đoạn"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Đoạn văn</SelectItem>
            <SelectItem value="h1">
              <span className="inline-flex items-center gap-1.5">
                <Heading1 className="size-3.5" /> Tiêu đề 1
              </span>
            </SelectItem>
            <SelectItem value="h2">
              <span className="inline-flex items-center gap-1.5">
                <Heading2 className="size-3.5" /> Tiêu đề 2
              </span>
            </SelectItem>
            <SelectItem value="h3">
              <span className="inline-flex items-center gap-1.5">
                <Heading3 className="size-3.5" /> Tiêu đề 3
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <ToolbarButton
          label="Đậm"
          active={editor.isActive('bold')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          label="Nghiêng"
          active={editor.isActive('italic')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </ToolbarButton>
        <ToolbarButton
          label="Gạch dưới"
          active={editor.isActive('underline')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Gạch ngang"
          active={editor.isActive('strike')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <ToolbarButton
          label="Danh sách dấu đầu dòng"
          active={editor.isActive('bulletList')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </ToolbarButton>
        <ToolbarButton
          label="Danh sách đánh số"
          active={editor.isActive('orderedList')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </ToolbarButton>
        <ToolbarButton
          label="Trích dẫn"
          active={editor.isActive('blockquote')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <ToolbarButton
          label="Căn trái"
          active={editor.isActive({ textAlign: 'left' })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft />
        </ToolbarButton>
        <ToolbarButton
          label="Căn giữa"
          active={editor.isActive({ textAlign: 'center' })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter />
        </ToolbarButton>
        <ToolbarButton
          label="Căn phải"
          active={editor.isActive({ textAlign: 'right' })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <ToolbarButton
          label="Chèn / sửa liên kết"
          active={editor.isActive('link')}
          disabled={disabled}
          onClick={setLink}
        >
          <Link2 />
        </ToolbarButton>
        <ToolbarButton
          label="Gỡ liên kết"
          disabled={disabled || !editor.isActive('link')}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink />
        </ToolbarButton>
        <ToolbarButton
          label="Xóa định dạng"
          disabled={disabled}
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          <RemoveFormatting />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
