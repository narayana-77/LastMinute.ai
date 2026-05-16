# Auth UI Implementation Plan

This plan outlines the architecture and design implementation for the complete authentication system UI for the LastMinute platform.

## Goal
Build a modern, fully responsive, glassmorphism-styled authentication flow including Login, Signup, Forgot Password, and OTP Verification pages. 

## User Review Required
> [!IMPORTANT]
> To handle navigation between the main landing page and these new authentication pages, I will install and configure `react-router-dom`. The application structure will be updated so that the landing page lives at the root route (`/`), while auth pages live under their respective routes (e.g., `/login`, `/signup`). 

## Proposed Changes

### Setup & Dependencies
- Install `react-router-dom` for client-side routing.

### Architecture & Routing (`src/App.jsx` & `src/main.jsx`)
- Wrap the application in a `BrowserRouter`.
- Set up routes:
  - `/` -> `LandingPage` (Refactor current `App.jsx` content into a `LandingPage` component).
  - `/login` -> `Login` page.
  - `/signup` -> `Signup` page.
  - `/forgot-password` -> `ForgotPassword` page.
  - `/verify-otp` -> `OtpVerification` page.

### Layout Components
#### [NEW] `src/layouts/AuthLayout.jsx`
- A reusable layout wrapper for all auth pages.
- Will feature a split-screen design on desktop:
  - **Left Side**: Futuristic AI illustration panel with glowing background effects, reinforcing the brand.
  - **Right Side**: The glassmorphism card containing the specific form.

### Page Components (`src/pages/auth/`)
#### [NEW] `Login.jsx`
- Form with Email, Password (with eye toggle), "Remember Me", and a Forgot Password link.
- Social login buttons (Google, GitHub).
- Smooth loading state on the primary action button.

#### [NEW] `Signup.jsx`
- Form with Full Name, Email, Password, Confirm Password, and T&C checkbox.
- Integration of social login buttons.

#### [NEW] `ForgotPassword.jsx`
- Email input form.
- Simulated success state (e.g., "Link sent!").
- Button to route back to the Login page.

#### [NEW] `OtpVerification.jsx`
- 6-digit OTP input boxes with auto-focus advancing.
- Verify button with loading state.
- Resend OTP countdown timer.
- Simulated success animation upon verification.

### Shared UI Components
#### [NEW] `src/components/auth/AuthInput.jsx`
- Reusable styled input component for consistency.
#### [NEW] `src/components/auth/SocialAuth.jsx`
- Reusable social login button group.
#### [NEW] `src/components/auth/AuthStyles.css`
- Core CSS for the auth pages ensuring they match the landing page's neon/glassmorphism aesthetics.

## Verification Plan
### Automated Verification
- Run `npm run build` to ensure the updated routing and new components compile perfectly.
### Manual Verification
- Verify that `react-router-dom` smoothly navigates between all auth pages without full page reloads.
- Test the 6-digit OTP input logic (pasting, auto-advancing focus).
- Test the responsive behavior of the split-screen `AuthLayout` on mobile viewports.
- Confirm loading states and success animations trigger correctly.
