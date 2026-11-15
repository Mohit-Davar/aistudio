export type EmailJob =
  | { type: "verify-email"; to: string; name: string; url: string }
  | { type: "reset-password"; to: string; name: string; url: string }
  | { type: "password-changed"; to: string; name: string; resetUrl: string }
  | {
      type: "existing-account";
      to: string;
      name: string;
      loginUrl: string;
      resetUrl: string;
    }
  | { type: "invitation"; to: string; organisationName: string; url: string };

export type RenderedEmail = {
  subject: string;
  text: string;
  html: string;
};

// Light-mode tokens, hex versions of the app theme (emails can't use oklch or CSS variables).
// Dark-mode equivalents live in the <style> block inside layout().
const brand = {
  primary: "#3fafd5", // --primary
  primaryForeground: "#082f3b", // dark text on brand blue (white on #3fafd5 is only ~2.5:1 contrast)
  foreground: "#161a1f", // --foreground
  body: "#3b424a", // between --foreground and --muted-foreground
  muted: "#626a73", // --muted-foreground
  mutedBg: "#f3f5f7", // --muted / --secondary
  border: "#e2e6ea", // --border
  card: "#ffffff", // --card
  page: "#f3f5f7", // page background behind the card
  accentBg: "#e6f5fa", // --accent
  accentFg: "#176580", // --accent-foreground
  warnBg: "#fdf6df", // --status-warning-bg
  warnBar: "#e5a50a", // --status-warning
  warnFg: "#7a4b05", // --status-warning-fg
};

// Host a 112x112 PNG (rounded corners baked in, under ~10 KB) on your own domain.
// Displayed at 36x36 so it stays sharp on retina screens.
const LOGO_URL =
  process.env.EMAIL_LOGO_URL ?? "https://vizibble.com/email/logo-112.png";

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function greeting(name: string): string {
  const first = name.trim().split(/\s+/)[0];
  return first ? `Hi ${first},` : "Hello,";
}

// Inline text link with a label (no raw URL shown)
function link(url: string, label: string): string {
  return `<a class="t-accent" href="${escapeHtml(url)}" style="color:${brand.accentFg};font-weight:600;text-decoration:underline;">${escapeHtml(label)}</a>`;
}

// Bulletproof button: VML for Outlook desktop, styled <a> for everyone else
function button(label: string, url: string): string {
  const href = escapeHtml(url);
  const text = escapeHtml(label);
  const width = Math.max(180, label.length * 10 + 64); // VML needs a fixed width

  return `<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:${width}px;" arcsize="17%" stroke="f" fillcolor="${brand.primary}">
<w:anchorlock/>
<center style="color:${brand.primaryForeground};font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${text}</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a class="btn" href="${href}" target="_blank" style="display:inline-block;background:${brand.primary};border-radius:8px;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;line-height:20px;color:${brand.primaryForeground};text-decoration:none;text-align:center;mso-hide:all;">${text}</a>
<!--<![endif]-->`;
}

type Tone = "info" | "warning";

type LayoutInput = {
  preheader: string;
  kicker: string; // small pill label above the heading
  heading: string;
  // Paragraphs are trusted HTML; escape user values before passing them in
  paragraphs: string[];
  details?: { label: string; value: string }[]; // plain text, escaped here
  action?: { label: string; url: string };
  footnote?: string;
  tone?: Tone;
};

function kickerPill(text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;"><tr>
    <td class="bg-accent t-accent" bgcolor="${brand.accentBg}" style="background:${brand.accentBg};border-radius:999px;padding:5px 12px;font-size:12px;line-height:16px;font-weight:600;letter-spacing:0.3px;color:${brand.accentFg};">${escapeHtml(text)}</td>
  </tr></table>`;
}

function detailsBox(details: { label: string; value: string }[]): string {
  const rows = details
    .map(
      (d, i) =>
        `<tr><td style="padding:${i === 0 ? "16px" : "0"} 18px 16px;">
          <div class="t-muted" style="font-size:12px;line-height:16px;color:${brand.muted};font-weight:500;">${escapeHtml(d.label)}</div>
          <div class="t-fg" style="font-size:15px;line-height:24px;color:${brand.foreground};font-weight:600;word-break:break-word;">${escapeHtml(d.value)}</div>
        </td></tr>`,
    )
    .join("");
  return `<table class="bg-muted bd" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${brand.mutedBg}" style="margin:4px 0 24px;background:${brand.mutedBg};border:1px solid ${brand.border};border-radius:10px;border-collapse:separate;">${rows}</table>`;
}

function callout(text: string, tone: Tone): string {
  const warn = tone === "warning";
  const bg = warn ? brand.warnBg : brand.accentBg;
  const bar = warn ? brand.warnBar : brand.primary;
  const color = warn ? brand.warnFg : brand.accentFg;
  const cls = warn ? "co-warn" : "co-info";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0;"><tr>
    <td width="4" bgcolor="${bar}" style="width:4px;background:${bar};font-size:0;line-height:0;">&nbsp;</td>
    <td class="${cls}" bgcolor="${bg}" style="background:${bg};padding:14px 18px;font-size:14px;line-height:22px;color:${color};">${escapeHtml(text)}</td>
  </tr></table>`;
}

function layout({
  preheader,
  kicker,
  heading,
  paragraphs,
  details,
  action,
  footnote,
  tone = "info",
}: LayoutInput): string {
  const body = paragraphs
    .map(
      (p) =>
        `<p class="t-body" style="margin:0 0 16px;font-size:15px;line-height:25px;color:${brand.body};">${p}</p>`,
    )
    .join("");

  const detailBlock = details && details.length ? detailsBox(details) : "";

  const cta = action
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0 28px;"><tr><td>${button(action.label, action.url)}</td></tr></table>`
    : "";

  const note = footnote ? callout(footnote, tone) : "";

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(heading)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style>
  @media only screen and (max-width:600px) {
    .px { padding-left:22px !important; padding-right:22px !important; }
    .btn { display:block !important; }
    h1 { font-size:22px !important; line-height:30px !important; }
  }
  /* Dark mode, mirrors the app's .dark tokens (Apple Mail, Outlook.com, iOS Mail and others) */
  @media (prefers-color-scheme: dark) {
    .bg-page { background:#0f1114 !important; }
    .bg-card { background:#181b20 !important; }
    .bd { border-color:#2a2e34 !important; }
    .t-fg { color:#eceef1 !important; }
    .t-body { color:#c3c8ce !important; }
    .t-muted { color:#98a0a9 !important; }
    .bg-muted { background:#1f2328 !important; }
    .bg-accent { background:#173744 !important; }
    .t-accent { color:#8adbf2 !important; }
    .co-info { background:#173744 !important; color:#d6eef7 !important; }
    .co-warn { background:#2f2408 !important; color:#fbe3a6 !important; }
  }
</style>
</head>
<body class="bg-page" style="margin:0;padding:0;background:${brand.page};-webkit-text-size-adjust:100%;font-family:${FONT_STACK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
  <table class="bg-page" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${brand.page}" style="background:${brand.page};">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;">

        <!-- Brand row -->
        <tr><td style="padding:0 4px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="vertical-align:middle;">
              <img src="${escapeHtml(LOGO_URL)}" width="36" height="36" alt="Vizibble" style="display:block;border:0;outline:none;text-decoration:none;width:36px;height:36px;border-radius:9px;">
            </td>
            <td class="t-fg" style="vertical-align:middle;padding-left:10px;font-family:Arial,Helvetica,sans-serif;font-size:19px;font-weight:700;color:${brand.foreground};">Vizibble</td>
          </tr></table>
        </td></tr>

        <!-- Card -->
        <tr><td class="bg-card bd" bgcolor="${brand.card}" style="background:${brand.card};border:1px solid ${brand.border};border-radius:10px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <!-- Brand accent strip -->
            <tr><td bgcolor="${brand.primary}" height="4" style="background:${brand.primary};height:4px;font-size:0;line-height:0;border-radius:10px 10px 0 0;">&nbsp;</td></tr>
            <tr><td class="px" style="padding:36px 36px 36px;">
              ${kickerPill(kicker)}
              <h1 class="t-fg" style="margin:0 0 20px;font-size:24px;line-height:32px;font-weight:700;letter-spacing:-0.2px;color:${brand.foreground};">${escapeHtml(heading)}</h1>
              ${body}${detailBlock}${cta}${note}
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td class="t-muted" align="center" style="padding:24px 16px 0;font-size:12px;line-height:19px;color:${brand.muted};">
          You're receiving this email because of activity on your Vizibble account.<br>
          This is an automated message, so please don't reply to it.
        </td></tr>
        <tr><td class="t-muted" align="center" style="padding:10px 16px 0;font-size:12px;line-height:19px;color:${brand.muted};font-weight:600;">
          &copy; ${new Date().getFullYear()} Vizibble Systems
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function plainText(lines: string[]): string {
  return [...lines, "", "The Vizibble Team"].join("\n");
}

export function renderEmail(job: EmailJob): RenderedEmail {
  switch (job.type) {
    case "verify-email": {
      const footnote =
        "This link expires in 1 hour. If you didn't create a Vizibble account, you can ignore this email.";
      return {
        subject: "Verify your email for Vizibble",
        text: plainText([
          greeting(job.name),
          "",
          "Confirm your email address to finish setting up your Vizibble account:",
          job.url,
          "",
          footnote,
        ]),
        html: layout({
          preheader: "Confirm your email to finish setting up your account.",
          kicker: "Email verification",
          heading: "Verify your email",
          paragraphs: [
            escapeHtml(greeting(job.name)),
            "Confirm your email address to finish setting up your Vizibble account.",
          ],
          details: [{ label: "Account email", value: job.to }],
          action: { label: "Verify email", url: job.url },
          footnote,
        }),
      };
    }

    case "reset-password": {
      const footnote =
        "This link expires in 1 hour and works once. If you didn't ask to reset your password, ignore this email and your password will stay the same.";
      return {
        subject: "Reset your Vizibble password",
        text: plainText([
          greeting(job.name),
          "",
          "We received a request to reset your password. Open the link below to choose a new one:",
          job.url,
          "",
          footnote,
        ]),
        html: layout({
          preheader: "Use this link to choose a new password.",
          kicker: "Password reset",
          heading: "Reset your password",
          paragraphs: [
            escapeHtml(greeting(job.name)),
            "We received a request to reset your password. Use the button below to choose a new one.",
          ],
          action: { label: "Reset password", url: job.url },
          footnote,
        }),
      };
    }

    case "password-changed":
      return {
        subject: "Your Vizibble password was changed",
        text: plainText([
          greeting(job.name),
          "",
          "Your password was just changed, and you've been signed out on all devices.",
          "",
          `If you didn't make this change, reset your password now: ${job.resetUrl}`,
        ]),
        html: layout({
          preheader: "You've been signed out on all devices.",
          kicker: "Security alert",
          heading: "Your password was changed",
          paragraphs: [
            escapeHtml(greeting(job.name)),
            "Your password was just changed, and you've been signed out on all devices.",
            "If you didn't make this change, reset your password now.",
          ],
          action: { label: "Reset password", url: job.resetUrl },
          footnote:
            "If this was you, no further action is needed. You can sign back in with your new password.",
          tone: "warning",
        }),
      };

    case "existing-account":
      return {
        subject: "Sign-up attempt with your email",
        text: plainText([
          greeting(job.name),
          "",
          "Someone tried to create a Vizibble account with this email address, but you already have one.",
          `Log in: ${job.loginUrl}`,
          `Forgot your password? ${job.resetUrl}`,
          "",
          "If this wasn't you, you don't need to do anything.",
        ]),
        html: layout({
          preheader: "You already have an account with this email.",
          kicker: "Account notice",
          heading: "You already have an account",
          paragraphs: [
            escapeHtml(greeting(job.name)),
            "Someone tried to create a Vizibble account with this email address, but you already have one.",
            `Forgot your password? ${link(job.resetUrl, "Reset it")}.`,
          ],
          action: { label: "Log in", url: job.loginUrl },
          footnote: "If this wasn't you, you don't need to do anything.",
        }),
      };

    case "invitation":
      return {
        subject: `You're invited to join ${job.organisationName} on Vizibble`,
        text: plainText([
          "Hello,",
          "",
          `You have been invited to join ${job.organisationName} on Vizibble.`,
          "",
          "To accept, open the link below and sign in or create an account using this email address:",
          job.url,
          "",
          "If you were not expecting this invitation, you can safely ignore this email.",
        ]),
        html: layout({
          preheader: `Join ${job.organisationName} on Vizibble.`,
          kicker: "Invitation",
          heading: `Join ${job.organisationName}`,
          paragraphs: [
            "Hello,",
            `You have been invited to join <strong>${escapeHtml(job.organisationName)}</strong> on Vizibble.`,
            "Sign in or create an account using the email address below to accept.",
          ],
          details: [
            { label: "Organisation", value: job.organisationName },
            { label: "Invited email", value: job.to },
          ],
          action: { label: "Accept invitation", url: job.url },
          footnote:
            "If you were not expecting this invitation, you can safely ignore this email.",
        }),
      };
  }
}
