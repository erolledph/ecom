# Premium Features Enforcement Summary

This document explains how premium features are automatically disabled when a user's free trial expires or is force-ended by an administrator.

## Overview

When a user's 7-day free trial expires OR when an admin force-ends their trial, ALL premium features are automatically disabled both in the dashboard and on their public store page.

## Premium Features List

The following features are restricted to premium users only:

### 1. **Display Categories** (Public Store Feature)
- **Dashboard Control**: Store Settings page - "Display Categories" toggle
- **Enforcement**:
  - Automatically disabled in settings when trial expires
  - Hidden on public store when `isOwnerPremiumActive` is false
  - Toggle is disabled in dashboard for non-premium users

### 2. **Pop-up Banner** (Public Store Feature)
- **Dashboard Control**: Store Settings page - "Enable Pop-up Banner" toggle
- **Enforcement**:
  - Automatically disabled in settings when trial expires
  - Not displayed on public store when `isOwnerPremiumActive` is false
  - Toggle is disabled in dashboard for non-premium users
  - Banner popup will not appear even if previously configured

### 3. **Floating Widget** (Public Store Feature)
- **Dashboard Control**: Store Settings page - "Enable Floating Widget" toggle
- **Enforcement**:
  - Automatically disabled in settings when trial expires
  - Not displayed on public store when `isOwnerPremiumActive` is false
  - Toggle is disabled in dashboard for non-premium users
  - Widget will not appear even if previously configured

### 4. **CSV Product Import** (Dashboard Feature)
- **Location**: Products page - CSV Import section
- **Enforcement**:
  - Wrapped in `PremiumFeatureGate` component
  - Shows upgrade message when accessed by non-premium users
  - Completely hidden from non-premium users after trial expires

### 5. **Data Export** (Dashboard Feature)
- **Location**: Subscribers page - Export CSV button
- **Enforcement**:
  - Protected by `canAccessFeature(userProfile, 'export')` check
  - Button is disabled for non-premium users
  - Export function fails silently for non-premium users

### 6. **Product Limits**
- **Standard Users**: Maximum 30 products
- **Premium Users**: Unlimited products
- **Enforcement**:
  - Checked in `addProduct()` function
  - Checked in `addProductsBatch()` function (CSV import)
  - Add Product button disabled when limit reached
  - Clear warning messages displayed in products page

## Implementation Details

### Backend Enforcement (lib/store.ts)

The `updateStore()` function automatically enforces premium restrictions:

```typescript
// Enforce restrictions for standard users
if (!isUserPremium) {
  // Override restricted features to false
  if (updates.showCategories === true) {
    updates.showCategories = false;
  }
  if (updates.bannerEnabled === true) {
    updates.bannerEnabled = false;
  }
  if (updates.widgetEnabled === true) {
    updates.widgetEnabled = false;
  }
}
```

### Frontend Enforcement (Public Store)

The `StoreTemplate.tsx` component checks premium status before displaying features:

```typescript
// Check if owner's trial has expired or premium revoked
const isOwnerPremiumActive = store.ownerIsPremiumAdminSet === true ||
  (store.ownerTrialEndDate && store.ownerTrialEndDate instanceof Date &&
   store.ownerTrialEndDate.getTime() > Date.now());

// Features are only displayed if isOwnerPremiumActive is true
{store.showCategories !== false && isOwnerPremiumActive && categories.length > 1 && (
  // Categories section
)}

{store.widgetEnabled !== false && isOwnerPremiumActive && (store.widgetImage || store.avatar) && (
  // Floating widget
)}

{store.bannerEnabled !== false && isOwnerPremiumActive && showBannerPopup && store.bannerImage && (
  // Pop-up banner
)}
```

### Dashboard Enforcement

1. **Store Settings Page**:
   - Premium toggles are disabled for non-premium users
   - Settings are automatically set to `false` when loading if user is not premium
   - Warning banner displayed when trial expires

2. **Products Page**:
   - Add Product button disabled when 30-product limit reached
   - Warning banner displayed when at limit
   - CSV Import section hidden via `PremiumFeatureGate`

3. **Subscribers Page**:
   - Export button disabled for non-premium users
   - Export function checks `canAccessFeature()` before executing

## User Experience

### When Trial Expires

1. **Dashboard Changes**:
   - Red warning banner appears on Store Settings, Products, and Subscribers pages
   - Premium feature toggles become disabled
   - CSV Import section is hidden
   - Export button is disabled
   - Add Product button disabled if over 30 products

2. **Public Store Changes**:
   - Categories section disappears
   - Pop-up banner stops showing
   - Floating widget disappears
   - Products limited to 30 (newest products shown first)

### When Admin Force-Ends Trial

The `updateUserTrialStatus()` function in `lib/auth.ts` handles force-ending trials:

```typescript
await updateDoc(userRef, {
  trialEndDate: new Date(0),  // Set to epoch (past date)
  isPremium: false,
  isPremiumAdminSet: false,
  updatedAt: new Date()
});

// Also updates store document
await updateDoc(storeRef, {
  ownerIsPremiumAdminSet: false,
  ownerTrialEndDate: new Date(0),
  updatedAt: new Date()
});
```

This immediately revokes all premium access, same as natural expiration.

## Premium Status Determination

A user is considered premium if ANY of these conditions are met:

1. User is an admin (`userProfile.role === 'admin'`)
2. Admin granted permanent premium (`userProfile.isPremiumAdminSet === true`)
3. Trial is still active (`userProfile.trialEndDate > Date.now()`)

```typescript
export const isPremium = (userProfile: UserProfile | null): boolean => {
  if (!userProfile) return false;

  // Admin users always have premium access
  if (isAdmin(userProfile)) return true;

  // If premium was set by admin, it's permanent
  if (userProfile.isPremiumAdminSet === true) return true;

  // Check if trial is still active
  if (userProfile.trialEndDate &&
      userProfile.trialEndDate instanceof Date &&
      userProfile.trialEndDate.getTime() > Date.now()) {
    return true;
  }

  return false;
};
```

## Data Persistence

All premium feature settings are stored in both:

1. **User Document** (`users/{userId}`):
   - `isPremium`: Current premium status
   - `isPremiumAdminSet`: Whether admin granted permanent premium
   - `trialEndDate`: When trial ends

2. **Store Document** (`users/{userId}/stores/{userId}`):
   - `ownerIsPremiumAdminSet`: Synced from user document
   - `ownerTrialEndDate`: Synced from user document
   - `showCategories`: Feature toggle
   - `bannerEnabled`: Feature toggle
   - `widgetEnabled`: Feature toggle

This dual storage ensures:
- Public store pages can check premium status without authentication
- Feature settings persist but are overridden when premium expires
- Admin changes to premium status immediately reflect on public stores

## Testing Checklist

To verify premium features are properly disabled:

1. ✅ Create a user and let trial expire naturally (7 days)
2. ✅ Verify categories, banner, and widget disappear from public store
3. ✅ Verify user cannot enable premium toggles in dashboard
4. ✅ Verify CSV import is hidden
5. ✅ Verify data export is disabled
6. ✅ Verify product limit is enforced at 30
7. ✅ Create a user and have admin force-end trial
8. ✅ Verify same restrictions apply as natural expiration
9. ✅ Have admin grant permanent premium
10. ✅ Verify all premium features become accessible again

## Troubleshooting

### Features Not Disabling

If premium features are not being disabled after trial expiration:

1. Check `userProfile.trialEndDate` is correctly set
2. Check `store.ownerTrialEndDate` is synced with user profile
3. Check `isPremium(userProfile)` returns `false`
4. Verify store settings update enforces restrictions
5. Check `isOwnerPremiumActive` calculation in StoreTemplate

### Public Store Still Shows Premium Features

If public store still shows premium features after expiration:

1. Verify `store.ownerTrialEndDate` is in the past
2. Verify `store.ownerIsPremiumAdminSet` is `false`
3. Check `isOwnerPremiumActive` logic in StoreTemplate.tsx
4. Force refresh the store page (clear browser cache)

## Conclusion

This system ensures that when users' trials expire or are force-ended:

- **All premium features are automatically disabled**
- **No user action can bypass the restrictions**
- **Changes take effect immediately**
- **Both dashboard and public store are affected**
- **Clear warnings inform users about status changes**

The implementation is comprehensive, affecting both client-side UI and server-side data operations, ensuring complete enforcement of premium feature restrictions.
