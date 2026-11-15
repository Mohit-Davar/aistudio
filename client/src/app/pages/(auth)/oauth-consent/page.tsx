import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { authClient } from '@/app/pages/(auth)/client';
import { useOAuthClient } from '@/app/pages/(auth)/oauth-consent/hooks/use-oauth-client';
import { ErrorState } from '@/app/shared/components/states/error-state';
import { LoadingState } from '@/app/shared/components/states/loading-state';
import { Button } from '@/app/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/shared/components/ui/card';
import { getErrorMessage } from '@/app/shared/utils/error-message';

const SCOPE_DESCRIPTIONS: Record<string, string> = {
  'vizibble:read': 'View information and data within your organisation, subject to your assigned role.',
  openid: 'Verify your identity when signing in.',
  profile: 'Access your basic profile information.',
  email: 'Access your email address.',
  offline_access: 'Maintain access when you are not actively using the application.',
};

const SCOPE_LABELS: Record<string, string> = {
  'vizibble:read': 'Read access',
  offline_access: 'Persistent access',
  openid: 'Identity verification',
  profile: 'Profile information',
  email: 'Email address',
};

function getScopeLabel(scope: string) {
  return SCOPE_LABELS[scope] ?? scope;
}

const WRITE_SCOPE = 'vizibble:write';

type ConsentAction = 'allow' | 'deny';

export function OAuthConsentPage() {
  const [searchParams] = useSearchParams();

  const clientId = searchParams.get('client_id') ?? '';

  const requestedScopes = (searchParams.get('scope') ?? '').split(/\s+/).filter(Boolean);

  const wantsWrite = requestedScopes.includes(WRITE_SCOPE);

  const readScopes = requestedScopes.filter((scope) => scope !== WRITE_SCOPE);

  const [allowWrite, setAllowWrite] = useState(false);

  const [submitting, setSubmitting] = useState<ConsentAction | null>(null);

  const [error, setError] = useState<string | null>(null);

  const client = useOAuthClient(clientId);

  const respond = async (accept: boolean) => {
    if (submitting !== null) return;

    setSubmitting(accept ? 'allow' : 'deny');
    setError(null);

    try {
      const grantedScopes = allowWrite ? requestedScopes : readScopes;

      const result = await authClient.oauth2.consent({
        accept,
        scope: grantedScopes.join(' '),
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Something went wrong. Please try connecting again.'));
      setSubmitting(null);
    }
  };

  if (!clientId) {
    return (
      <ErrorState
        variant="fullscreen"
        title="Invalid authorization request"
        message="The application ID is missing. Return to the application and start the connection process again."
      />
    );
  }

  if (client.isPending) {
    return <LoadingState variant="fullscreen" label="Loading authorization" />;
  }

  if (client.isError || !client.data) {
    return (
      <ErrorState
        variant="fullscreen"
        title="Unable to verify application"
        message="This application is not registered with Vizibble or the authorization request has expired."
      />
    );
  }

  const applicationName = client.data.client_name ?? 'Unknown application';

  return (
    <main className="bg-background flex min-h-svh items-center justify-center px-4 py-10">
      <div className="w-full max-w-110">
        <Card className="gap-0 overflow-hidden">
          <CardHeader className="space-y-2 border-b px-6 py-5">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Application authorisation
            </p>

            <CardTitle className="text-xl font-semibold tracking-tight">
              Allow access to your account?
            </CardTitle>

            <CardDescription className="text-sm leading-relaxed">
              <span className="text-foreground font-medium">{applicationName}</span> is requesting access to
              your Vizibble account. Review the permissions before continuing.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 px-6 py-5">
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">Requested permissions</h2>

                <span className="text-muted-foreground text-xs">
                  {readScopes.length} {readScopes.length === 1 ? 'permission' : 'permissions'}
                </span>
              </div>

              {readScopes.length > 0 ? (
                <ul className="divide-y rounded-md border">
                  {readScopes.map((scope) => (
                    <li key={scope} className="space-y-1 px-3.5 py-3">
                      <p className="text-sm font-medium">{getScopeLabel(scope)}</p>

                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {SCOPE_DESCRIPTIONS[scope] ?? 'Access to the requested resource.'}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground rounded-md border px-3.5 py-3 text-sm">
                  No additional read permissions requested.
                </p>
              )}
            </section>

            {wantsWrite && (
              <section className="border-t pt-4">
                <div className="flex items-start gap-3 rounded-md border p-3">
                  <input
                    id="allow-write-access"
                    type="checkbox"
                    className="accent-primary mt-0.5 size-4 shrink-0"
                    checked={allowWrite}
                    onChange={(event) => setAllowWrite(event.target.checked)}
                    disabled={submitting !== null}
                    aria-describedby="allow-write-description"
                  />

                  <div className="min-w-0 space-y-0.5">
                    <label htmlFor="allow-write-access" className="cursor-pointer text-sm font-medium">
                      Allow write access
                    </label>

                    <p id="allow-write-description" className="text-muted-foreground text-xs leading-relaxed">
                      Allow this application to create, update and delete organisation data.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-md border border-(--status-critical) bg-(--status-critical-bg) px-3 py-2.5 text-sm text-(--status-critical-fg)"
              >
                {error}
              </div>
            )}

            <p className="text-muted-foreground border-t pt-4 text-xs leading-relaxed">
              You can revoke this application&apos;s access at any time from your account settings. Access
              remains subject to your organisation&apos;s permissions.
            </p>
          </CardContent>

          <CardFooter className="bg-muted/20 flex flex-col-reverse gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={submitting !== null}
              onClick={() => void respond(false)}
            >
              {submitting === 'deny' ? 'Declining…' : 'Deny access'}
            </Button>

            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={submitting !== null}
              loading={submitting === 'allow'}
              onClick={() => void respond(true)}
            >
              Allow access
            </Button>
          </CardFooter>
        </Card>

        <p className="text-muted-foreground mt-4 text-center text-xs">Authorised by Vizibble</p>
      </div>
    </main>
  );
}
