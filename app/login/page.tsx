'use client';

import { useContext, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { BrandLogo, FadeIn } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  OTPInputContext,
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeMode } from '@/constants/enums/theme.enum';
import { APP_BRAND, APP_NAME } from '@/constants/menu';
import { DEFAULT_AUTHENTICATED_ROUTE } from '@/constants/routes';
import { clearPinUnlockedCookie, setPinUnlockedCookie, verifyPin } from '@/lib/auth/pin';
import { useTheme } from '@/lib/hooks/use-theme';
import { cn } from '@/lib/utils';

const PIN_LENGTH = 4;

function PinSlot({
  index,
  reveal,
  invalid,
}: {
  index: number;
  reveal: boolean;
  invalid?: boolean;
}) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      aria-invalid={invalid || undefined}
      className={cn(
        'relative flex size-12 items-center justify-center rounded-lg border border-input bg-background text-xl font-semibold transition-all outline-none',
        'data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50',
        'aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20',
      )}
    >
      {char ? (reveal ? char : '•') : null}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      ) : null}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { themeMode, toggleTheme } = useTheme();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    if (!verifyPin(pin)) {
      clearPinUnlockedCookie();
      setError('Mã PIN không đúng');
      toast.error('Mã PIN không đúng');
      setSubmitting(false);
      return;
    }

    setPinUnlockedCookie();
    toast.success('Đăng nhập thành công');
    router.replace(DEFAULT_AUTHENTICATED_ROUTE);
    router.refresh();
  }

  return (
    <main className="bg-auth-mesh relative flex min-h-full flex-1 items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute top-4 right-4 z-10 sm:top-5 sm:right-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-md bg-card/80 backdrop-blur"
              onClick={toggleTheme}
              aria-label="Đổi giao diện sáng/tối"
            >
              {themeMode === ThemeMode.DARK ? <Sun /> : <Moon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {themeMode === ThemeMode.DARK ? 'Chế độ sáng' : 'Chế độ tối'}
          </TooltipContent>
        </Tooltip>
      </div>

      <div
        aria-hidden
        className="auth-glow pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary opacity-[0.12] blur-3xl"
      />

      <FadeIn className="relative w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <BrandLogo
            size={64}
            priority
            className="mx-auto mb-4 shadow-[0_12px_32px_rgb(236_0_140_/_32%)]"
          />
          <span className="block text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            {APP_BRAND}
          </span>
          <h1 className="mt-2 mb-2 text-3xl font-semibold tracking-tight text-foreground">
            {APP_NAME}
          </h1>
          <p className="mb-0 text-sm text-balance text-muted-foreground">
            Nhập mã PIN để vào hệ thống tuyển dụng.
          </p>
        </div>

        <FadeIn delay={0.08} className="surface-panel p-6 sm:p-7">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Label htmlFor="pin" className="justify-center text-center">
                Mã PIN
              </Label>

              <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-1">
                <span aria-hidden className="size-12" />

                <InputOTP
                  id="pin"
                  maxLength={PIN_LENGTH}
                  value={pin}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  onChange={(value) => {
                    setPin(value);
                    if (error) setError(null);
                  }}
                  containerClassName="justify-center gap-2.5"
                  aria-invalid={!!error}
                  autoFocus
                >
                  {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                    <PinSlot key={index} index={index} reveal={showPin} invalid={!!error} />
                  ))}
                </InputOTP>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-12 justify-self-end rounded-lg text-muted-foreground"
                  aria-label={showPin ? 'Ẩn mã PIN' : 'Hiện mã PIN'}
                  onClick={() => setShowPin((prev) => !prev)}
                >
                  {showPin ? <EyeOff /> : <Eye />}
                </Button>
              </div>

              {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}
            </div>

            <Button
              type="submit"
              disabled={pin.length < PIN_LENGTH || submitting}
              className="mt-1 h-10 w-full"
            >
              Vào hệ thống
            </Button>
          </form>
        </FadeIn>
      </FadeIn>
    </main>
  );
}
