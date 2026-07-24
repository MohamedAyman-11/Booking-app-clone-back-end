const sendResetPasswordTemplate = `
  <!DOCTYPE html>

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset Password</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 0;">
    <tr>
      <td align="center">

    <table width="600" cellpadding="0" cellspacing="0"
      style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">

      <!-- Header -->
      <tr>
        <td
          style="background:#003b95;padding:32px;text-align:center;">
          <h1
            style="margin:0;color:#ffffff;font-size:32px;font-weight:700;">
            Booking.com
          </h1>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding:40px;">

          <h2
            style="margin-top:0;color:#1a1a1a;font-size:28px;">
            Reset your password
          </h2>

          <p
            style="font-size:16px;line-height:1.7;color:#4a5568;">
            We received a request to reset the password associated
            with your account.
          </p>

          <p
            style="font-size:16px;line-height:1.7;color:#4a5568;">
            Click the button below to choose a new password.
          </p>

          <div style="text-align:center;margin:40px 0;">
            <a
              href="<RESET_URL>"
              style="
                background:#0071c2;
                color:#ffffff;
                text-decoration:none;
                padding:16px 32px;
                border-radius:8px;
                font-size:16px;
                font-weight:600;
                display:inline-block;
              ">
              Reset Password
            </a>
          </div>

          <p
            style="font-size:15px;color:#4a5568;line-height:1.7;">
            This link will expire in
            <strong>5 minutes</strong>.
          </p>

          <p
            style="font-size:15px;color:#4a5568;line-height:1.7;">
            If you didn't request a password reset, you can safely
            ignore this email. Your account will remain secure.
          </p>

          <div
            style="
              margin-top:30px;
              padding:16px;
              background:#f8fafc;
              border-radius:8px;
              font-size:14px;
              color:#64748b;
              word-break:break-all;
            ">
            If the button doesn't work, copy and paste this link
            into your browser:
            <br /><br />
            ${`<RESET_URL>`}
          </div>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td
          style="
            background:#f8fafc;
            padding:24px;
            text-align:center;
            color:#64748b;
            font-size:14px;
          ">

          © 2026 Booking.com

          <br />

          Secure travel and accommodation booking platform.

        </td>
      </tr>

    </table>

  </td>
</tr>
  </table>
</body>
</html>
`;
const sendRestoreAccountOtpTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Account Recovery OTP</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td style="background:#003b95;padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:700;">
                Booking.com
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">

              <h2 style="margin-top:0;color:#1a1a1a;font-size:28px;">
                Account Recovery Verification
              </h2>

              <p style="font-size:16px;line-height:1.7;color:#4a5568;">
                We received a request to recover your account.
              </p>

              <p style="font-size:16px;line-height:1.7;color:#4a5568;">
                Use the verification code below to continue:
              </p>

              <div
                style="
                  text-align:center;
                  margin:40px 0;
                  background:#f8fafc;
                  border:2px dashed #0071c2;
                  border-radius:12px;
                  padding:24px;
                ">
                <span
                  style="
                    font-size:36px;
                    font-weight:700;
                    color:#003b95;
                    letter-spacing:8px;
                  ">
                  <OTP>
                </span>
              </div>

              <p style="font-size:15px;color:#4a5568;line-height:1.7;">
                This verification code will expire in
                <strong>5 minutes</strong>.
              </p>

              <p style="font-size:15px;color:#4a5568;line-height:1.7;">
                If you didn't request account recovery, you can safely
                ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                background:#f8fafc;
                padding:24px;
                text-align:center;
                color:#64748b;
                font-size:14px;
              ">
              © 2026 Booking.com
              <br />
              Secure travel and accommodation booking platform.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
module.exports = { sendResetPasswordTemplate, sendRestoreAccountOtpTemplate };
