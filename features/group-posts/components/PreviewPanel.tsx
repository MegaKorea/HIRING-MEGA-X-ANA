'use client';

type PreviewPanelProps = {
  content: string;
  category: string | null;
  previewUrl: string | null;
  groupCount: number;
};

export function PreviewPanel({
  content,
  category,
  previewUrl,
  groupCount,
}: PreviewPanelProps) {
  const trimmed = content.trim();
  const hasPreview = !!trimmed || !!previewUrl;

  return (
    <section className="flex min-h-0 min-w-0 flex-col rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-5 md:p-6 lg:min-h-[32rem] lg:rounded-none lg:border-0 lg:bg-muted/20 lg:p-6 lg:shadow-none xl:min-h-[36rem] xl:p-8">
      <div className="mb-4 sm:mb-5">
        <h2 className="text-base font-semibold text-foreground">Xem trước</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Bài đăng sẽ hiển thị như thế này trên nhóm.
        </p>
      </div>

      <div className="flex min-w-0 flex-1 items-stretch">
        {hasPreview ? (
          <article className="flex min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary sm:size-11 sm:text-sm">
                MX
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">Mega X Ana</p>
                <p className="truncate text-xs text-muted-foreground">
                  {category ? `Danh mục · ${category}` : 'Chưa chọn danh mục'}
                  {category && groupCount > 0 ? ` · ${groupCount} nhóm` : ''}
                </p>
              </div>
            </div>

            {trimmed ? (
              <div className="min-w-0 flex-1 break-words whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed text-foreground sm:px-5 sm:py-4 sm:text-[15px] [overflow-wrap:anywhere]">
                {content}
              </div>
            ) : null}

            {previewUrl ? (
              <div className="border-t border-border/60 bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element -- blob preview URL */}
                <img
                  src={previewUrl}
                  alt="Xem trước bài đăng"
                  className="mx-auto max-h-52 w-full object-contain sm:max-h-72 lg:max-h-[28rem]"
                />
              </div>
            ) : null}
          </article>
        ) : (
          <div className="flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 px-4 py-8 text-center sm:min-h-64 sm:px-6">
            <p className="text-sm font-medium text-foreground">Chưa có nội dung xem trước</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              <span className="lg:hidden">
                Nhập nội dung hoặc chọn ảnh phía trên để xem bài đăng.
              </span>
              <span className="hidden lg:inline">
                Nhập nội dung hoặc chọn ảnh bên trái để xem bài đăng.
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
