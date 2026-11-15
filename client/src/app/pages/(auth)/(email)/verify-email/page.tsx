import { LinkBreakIcon } from '@phosphor-icons/react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';

import { AuthNotice } from '@/app/pages/(auth)/shared/components/auth-notice';
import { useSession } from '@/app/pages/(auth)/shared/hooks/use-session';
import { getSafeReturnPath, type CheckEmailState } from '@/app/pages/(auth)/shared/utils/auth-redirects';
import { LoadingState } from '@/app/shared/components/states/loading-state';
import { Button } from '@/components/ui/button';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();

  const session = useSession();

  const error = searchParams.get('error');

  const next = getSafeReturnPath(searchParams.get('next'), '/dashboard');

  if (!error) {
    if (session.status === 'loading') {
      return <LoadingState label="Checking your session…" variant="fullscreen" />;
    }

    if (session.status === 'signed-in' && session.emailVerified) {
      return <Navigate to={next} replace />;
    }
  }

  if (!error) {
    return <Navigate to="/login" replace />;
  }

  const expired = error.toLowerCase().includes('expired');

  const state: CheckEmailState = { next };

  return (
    <AuthNotice
      icon={LinkBreakIcon}
      tone="destructive"
      title={expired ? 'This link has expired' : "This link isn't valid"}
      actions={
        <>
          <Button asChild size="lg" className="w-full">
            <Link to="/check-email" state={state}>
              Send a new link
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full">
            <Link to="/login">Back to log in</Link>
          </Button>
        </>
      }
    >
      <p>
        {expired
          ? 'Verification links last 1 hour. Request a new one and use it straight away.'
          : 'It may have been used already or copied incorrectly. If your email is already verified, you can log in.'}
      </p>
    </AuthNotice>
  );
}
