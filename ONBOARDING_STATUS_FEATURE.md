# Onboarding Status Feature Implementation

## Overview
Implemented a complete onboarding status tracking system that displays contextual banners to users based on their fellow profile submission status.

## Components Created

### 1. **OnboardingStatusBanner.jsx** (`client/src/components/Profile/OnboardingStatusBanner.jsx`)
A reusable banner component that handles 5 distinct onboarding states:

#### States & Messaging:

1. **NO_PROFILE** (Blue)
   - Title: "Action Required: Complete Your Fellow Profile"
   - CTA: "Start Now" → Navigates to `/onboarding/:registrationId`
   - Hint: "⏱️ Takes only 10 minutes"

2. **DRAFT** (Amber)
   - Title: "Draft Saved: Ready to Submit"
   - CTA: "Submit for Review" → Returns user to onboarding form
   - Hint: "📝 Continue editing your profile"

3. **SUBMITTED** (Purple)
   - Title: "Profile Under Review"
   - No CTA (info-only state)
   - Hint: "⏳ Review typically takes 2-3 business days"

4. **REVISION_NEEDED** (Orange)
   - Title: "Revision Needed"
   - CTA: "Review & Revise" → Returns to form for editing
   - Shows admin feedback comments in expandable section
   - Hint: "✏️ Check the comments in your profile"

5. **APPROVED** (Hidden)
   - Banner is not displayed (null return)
   - User has completed onboarding

### 2. **Updated TabContent.jsx** (`client/src/components/Profile/TabContent.jsx`)
- Added `OnboardingStatusBanner` import
- Added state management: `fellowProfiles` & `loadingProfiles`
- Implemented `useEffect` to fetch profile status for each registration
- Renders banner above each registration card (only if profile not approved)

### 3. **Backend Endpoint** (`server/Controllers/fellowProfileController.js`)
Added `getFellowProfileByRegistration` handler:

```
GET /api/fellow-profile/:registrationId
Access: Private (authenticated user)

Response (if profile exists):
{
  profile: {
    _id: string,
    status: 'DRAFT' | 'SUBMITTED' | 'REVISION_NEEDED' | 'APPROVED',
    adminComments: [],
    submittedAt: Date,
    approvedAt: Date,
    displayName: string,
    headline: string
  }
}

Response (if no profile):
{ profile: null }
```

### 4. **Router Update** (`server/Routes/fellowProfileRouter.js`)
- Added new route: `GET /:registrationId` → `getFellowProfileByRegistration`
- Requires authentication

## User Flow

```
1. User views "Current Registrations" tab
   ↓
2. Component fetches profile status for each registration
   ↓
3. Based on status, appropriate banner is displayed:
   
   No Profile → [Start Now button]
        ↓
   Draft → [Submit for Review button]
        ↓
   Submitted → [Info banner, no action]
        ↓
   Revision Needed → [Review & Revise button + admin comments]
        ↓
   Approved → [No banner shown]
```

## Key Features

✅ **5 Distinct States** with appropriate color coding, icons, and messaging
✅ **Dynamic CTAs** that navigate directly to onboarding form when needed
✅ **Admin Feedback Display** shows comments when revision is needed
✅ **Responsive Design** works on mobile and desktop
✅ **Non-blocking** banner displays above card, doesn't interfere with registration info
✅ **Auto-fetch** profile status for each registration on tab switch
✅ **Authenticated** backend endpoint ensures users can only see their own profiles

## Integration Points

**Frontend:**
- `ProfileDashboard.jsx` passes `currentRegistrations` to `TabContent`
- `TabContent` fetches profile status and renders `OnboardingStatusBanner`
- Links to `/onboarding/:registrationId` route

**Backend:**
- `getFellowProfileByRegistration` queries `fellowProfileModel`
- Returns minimal profile data (status + comments only)
- Validates registration ownership

## Testing Checklist

- [ ] NO_PROFILE state: Shows "Start Now" button for new registration
- [ ] DRAFT state: Shows "Submit for Review" button for saved draft
- [ ] SUBMITTED state: Shows info banner without button
- [ ] REVISION_NEEDED state: Shows button + admin comments
- [ ] APPROVED state: Banner is not displayed
- [ ] Navigation: Clicking buttons routes to `/onboarding/:registrationId`
- [ ] Error handling: Graceful fallback if profile fetch fails
- [ ] Multiple registrations: Each shows correct status independently
