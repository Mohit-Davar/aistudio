import type { Icon } from '@phosphor-icons/react';
import type * as React from 'react';

type AuthNoticeProps = {
  icon: Icon;
  tone?: 'default' | 'success' | 'destructive';
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

const toneStyles = {
  default: {
    icon: 'bg-accent text-accent-foreground ring-border/50',
    accent: 'bg-accent',
  },
  success: {
    icon: 'bg-status-healthy-bg text-status-healthy-fg ring-status-healthy-fg/10',
    accent: 'bg-status-healthy-fg',
  },
  destructive: {
    icon: 'bg-destructive/10 text-destructive ring-destructive/10',
    accent: 'bg-destructive',
  },
};

export function AuthNotice({
  icon: IconComponent,
  tone = 'default',
  title,
  children,
  actions,
}: AuthNoticeProps) {
  const styles = toneStyles[tone];

  return (
    <section className="flex flex-col gap-8" aria-labelledby="auth-notice-title">
      <div className="space-y-5">
        <div
          className={`inline-flex size-14 items-center justify-center rounded-2xl ring-1 ring-inset ${styles.icon}`}
        >
          <IconComponent className="size-7" weight="duotone" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1
            id="auth-notice-title"
            className="text-foreground text-2xl font-semibold tracking-tight sm:text-[28px]"
          >
            {title}
          </h1>

          <div className="text-muted-foreground max-w-md space-y-3 text-sm leading-6">{children}</div>
        </div>
      </div>

      {actions && <div className="flex flex-col gap-3">{actions}</div>}
    </section>
  );
}
