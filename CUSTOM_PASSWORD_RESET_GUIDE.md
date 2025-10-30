# Custom Firebase Password Reset Implementation Guide

This guide explains the custom password reset implementation that redirects users to your website instead of Firebase's default hosted page.

## Overview

When users click "Forgot Password?" on your login page, they'll receive an email with a link that redirects to your custom password reset page at `/auth/reset-password`, instead of Firebase's default page.

## How It Works

### 1. Password Reset Flow

1. User clicks "Forgot Password?" on the login page (`/auth`)
2. User enters their email address
3. Firebase sends a password reset email with a custom URL pointing to your website
4. User clicks the link in the email
5. User is redirected to `/auth/reset-password?oobCode=XXXXXX`
6. Your custom page verifies the reset code
7. User enters and confirms their new password
8. Password is updated through Firebase Auth
9. User is redirected back to login page with success message

### 2. Implementation Details

#### Files Modified/Created:

**`lib/auth.ts`** - Updated with new functions:
- `resetPassword()` - Now includes `actionCodeSettings` to redirect to your custom page
- `verifyResetCode()` - Verifies the password reset code and returns the user's email
- `confirmPasswordResetWithCode()` - Confirms the password reset with the new password

**`app/auth/reset-password/page.tsx`** - NEW custom password reset page with:
- Code verification on page load
- Password strength validation (same rules as signup)
- Confirm password matching
- Error handling for expired/invalid links
- Success state with auto-redirect
- Responsive design matching your auth page

**`app/auth/page.tsx`** - Updated to:
- Show success message when redirected after password reset
- Uses `useSearchParams` to detect successful reset

### 3. Configuration

The custom URL is configured in `lib/auth.ts`:

```typescript
const actionCodeSettings = {
  url: `${window.location.origin}/auth/reset-password`,
  handleCodeInApp: true,
};
```

This tells Firebase to:
- Include the reset code as a query parameter (`oobCode`)
- Redirect to your website's custom page

## Firebase Console Configuration

**IMPORTANT:** You need to configure Firebase to allow your domain for password reset:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `dotkol`
3. Navigate to **Authentication** → **Templates** → **Password reset**
4. Under "Action URL", you'll see the default Firebase hosted page URL
5. The `actionCodeSettings` in the code will override this for your app

**OR**

1. Go to Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Make sure your domain is listed (e.g., `yourdomain.com`)
4. Firebase will automatically accept password reset redirects to authorized domains

## Testing the Implementation

### Local Testing:
1. Start your development server
2. Go to `/auth`
3. Click "Forgot Password?"
4. Enter a test user's email
5. Check the email inbox
6. Click the reset link in the email
7. Verify it redirects to `http://localhost:3000/auth/reset-password?oobCode=...`
8. Enter and confirm a new password
9. Verify redirect to login page with success message

### Production Testing:
Same steps as above, but the URL will be your production domain.

## Email Template

The password reset email is sent by Firebase. To customize the email template:

1. Go to Firebase Console → Authentication → Templates
2. Click on "Password reset"
3. Edit the email template
4. The link will automatically use your custom URL when `actionCodeSettings` is configured

## Security Features

✅ **Code Verification**: The reset code is verified before showing the password form
✅ **Code Expiration**: Firebase reset codes expire after 1 hour
✅ **Password Validation**: Same strong password requirements as signup
✅ **One-Time Use**: Reset codes can only be used once
✅ **HTTPS Only**: Production deployment should use HTTPS

## Password Requirements

Users must create passwords with:
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*(),.?":{}|<>)

## Error Handling

The custom page handles various error scenarios:

| Error | Message |
|-------|---------|
| Invalid/Missing Code | "Invalid or missing reset code" |
| Expired Link | "Invalid or expired reset link. Please request a new one" |
| Weak Password | "Password is too weak. Please use a stronger password" |
| User Not Found | "User account not found" |
| Account Disabled | "This account has been disabled" |

## UI/UX Features

✅ Live password validation with visual feedback
✅ Password visibility toggle
✅ Confirm password matching
✅ Loading states during verification and submission
✅ Success state with auto-redirect
✅ Responsive design for mobile and desktop
✅ Consistent branding with your auth page

## Troubleshooting

### Issue: Reset link goes to Firebase's default page
**Solution**: Make sure your app is using the updated `resetPassword` function with `actionCodeSettings`.

### Issue: "Invalid reset code" error
**Solution**: Reset codes expire after 1 hour. Request a new password reset link.

### Issue: Email not sending
**Solution**:
1. Check Firebase Console → Authentication → Templates
2. Verify email template is enabled
3. Check spam folder
4. Verify email address is correct in Firebase Auth users

### Issue: Redirect not working
**Solution**:
1. Verify your domain is in Firebase's authorized domains list
2. Check that `window.location.origin` returns the correct domain
3. Make sure the email link has the `oobCode` parameter

## Next Steps

To further customize:

1. **Email Template**: Customize the email design in Firebase Console
2. **Styling**: Modify the Tailwind classes in `/app/auth/reset-password/page.tsx`
3. **Validation Rules**: Update password requirements in `lib/auth.ts`
4. **Success Behavior**: Change the redirect destination or timing after successful reset

## API Reference

### `resetPassword(email: string)`
Sends a password reset email with a link to your custom page.

**Parameters:**
- `email`: User's email address

**Throws:**
- Error if Firebase is not initialized
- Error if email doesn't exist

### `verifyResetCode(code: string): Promise<string>`
Verifies the password reset code and returns the user's email.

**Parameters:**
- `code`: The `oobCode` from the URL query parameter

**Returns:**
- Promise resolving to the user's email address

**Throws:**
- Error if code is invalid or expired

### `confirmPasswordResetWithCode(code: string, newPassword: string)`
Confirms the password reset with the new password.

**Parameters:**
- `code`: The `oobCode` from the URL query parameter
- `newPassword`: The new password

**Throws:**
- Error if code is invalid or expired
- Error if password is too weak

## Support

If you encounter any issues with the password reset functionality:

1. Check the browser console for error messages
2. Verify Firebase configuration in `.env` file
3. Check Firebase Console for authentication logs
4. Review this documentation for troubleshooting steps

---

**Implementation Date**: 2025-10-29
**Framework**: Next.js 14.2.0
**Authentication**: Firebase Auth
