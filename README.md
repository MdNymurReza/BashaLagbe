# UIUNest - Project Overview

**UIUNest** is a comprehensive housing and community platform specifically designed for students and individuals residing around the UIU (United International University) campus. It aims to solve the common challenges of finding suitable accommodation, compatible flatmates, managing shared expenses, and trading essential items within the campus community.

## 🚀 Tech Stack

- **Frontend & Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript
- **Backend & Database:** Supabase (PostgreSQL, Authentication, Realtime, Storage)
- **Maps:** Leaflet.js (via `leaflet` and `react-leaflet`)
- **Styling & UI:** Custom CSS (Modules & Globals), Lucide React (Icons)
- **Forms & Validation:** Zod
- **Notifications:** Sonner (Toast notifications)
- **Charts:** Chart.js (via `react-chartjs-2`)

## 🎯 Core Features

### 1. Listings Browser (Housing Search)
- **Comprehensive Listings:** Browse available housing options around the UIU campus.
- **Transparent Pricing:** Displays total monthly costs upfront, including rent and all utility bills (electricity, gas, water, internet), eliminating hidden charges.
- **Advanced Filtering:** Filter by Zone, Property Type (Single Room, Shared, Full Mess, Sublet), Rent Range, Gender Preference, and Furnished status.
- **Interactive Map View:** View listings on a map powered by Leaflet.js.
- **Detailed Property Pages:** Includes image galleries, amenities list, full cost breakdown, user reviews, and an interactive offer section.

### 2. Flatmate Compatibility Matching
- **8-Dimension Compatibility Score:** Calculates compatibility based on lifestyle preferences: sleep schedule, dietary habits, cleanliness, noise tolerance, guest rules, study time, smoking/drinking habits, and gender preference.
- **Match Indicators:** Displays visual match scores such as **High Match (92%)**, **Good Match (71%)**, or **Low Match (38%)** to help users find the perfect flatmate.

### 3. Seeking Posts (Room/Flatmate Wanted)
- **Dedicated Ads:** Users can post ads in the "Seeking Flatmates" section specifying their requirements.
- **Detailed Preferences:** Posts include budget, preferred location, lifestyle preferences, and direct contact buttons.
- **Filtering:** Browse seeking posts by Property Type, Zone, and Preferred Gender.

### 4. UIUNest Exchange (Marketplace)
- **Campus Marketplace:** Buy and sell pre-owned essential items (e.g., fans, tables, chairs, electronics) within the campus zone.
- **Interactive Offer System:** Buyers can make price offers. Sellers can choose to **Accept**, **Reject**, or provide a **Counter Offer**.
- **Item Details:** Includes photos, descriptions, and seller profiles.

### 5. Mess Bill Manager
- **Automated Billing:** Landlords or mess managers can generate comprehensive monthly bills (electricity, gas, water, internet, plus custom fees like cleaners or security).
- **Per-Head Calculation:** Automatically calculates and divides the total cost among residents.
- **Payment Tracking:** Tracks the payment status (Paid / Unpaid) for each resident, accessible by both landlords and tenants.

### 6. Review & Rating System
- **5-Dimension Rating:** Users can rate properties based on:
  1. Value for Money
  2. Listing Accuracy
  3. Landlord Response
  4. Cleanliness
  5. Safety
- **Verified Reviews:** Users can leave written feedback along with a composite score (limited to one review per listing).

### 7. Real-Time Messaging System
- **Direct Communication:** Seamless peer-to-peer messaging between users.
- **Integrated Access:** Initiate chats directly from listing pages, exchange items, or seeking posts.
- **Unread Indicators:** Navbar includes a message icon with unread message counts.

### 8. Notification System
- **Real-Time Alerts:** In-app notification bell with unread counts.
- **Categorized Notifications:** Alerts for ID verification status, complaints, listing updates, and general system announcements.

### 9. User Profiles & Authentication
- **Secure Login:** Authentication powered by Supabase Auth, restricted or preferred for UIU Email addresses.
- **Role-Based Access:** Distinct roles for `student`, `landlord`, and `admin`.
- **Personalized Profiles:** Users can upload avatars, set lifestyle preferences, and manage a **Watchlist** of favorite listings.
- **Account Security:** Suspended users are automatically signed out.

### 10. Landlord Verification System
- **Trust & Safety:** Landlords can upload official documents (NID, Passport, or Driving License) for identity verification.
- **Admin Moderation:** Admins review documents to Approve, Reject, or Revoke verified status.
- **Verified Badge:** Approved landlords receive a verified badge (BadgeCheck icon) on their profiles and listings.

### 11. Complaints & Moderation
- **User Reporting:** Users can file complaints against problematic listings or other users.
- **Admin Resolution:** Admins have tools to review, investigate, resolve, or dismiss complaints to maintain platform safety.

### 12. Admin Dashboard
A dedicated, secure management panel organized into five primary tabs:
- **Overview:** Statistics on total listings, users, open complaints, and pending verifications. Includes charts for average rent by zone and demand vs. supply.
- **Users & Listings:** Manage user accounts (Suspend/Activate) and oversee all platform listings (Delete/Moderate).
- **ID Verifications:** Review submitted documents and manage landlord verification statuses.
- **Complaints:** Centralized view of all user reports with resolution tools.
- **Notifications:** Send and monitor system-wide notifications.

### 13. Enhanced UI/UX Features
- **Smart Navbar:** Auto-hides on scroll down and reappears on scroll up; includes a mobile-responsive hamburger menu.
- **Hero Search:** Quick access to listing searches directly from the home page.
- **Map Picker:** Interactive map tool for pinpointing exact locations when creating a listing.
- **Dynamic Statuses:** Landlords can quickly change listing statuses (Available / Occupied / Paused).
- **Form Validation:** Comprehensive schema-level validation using Zod for robust data entry.

## 🗄️ Database Schema Summary
The Supabase PostgreSQL database includes the following core tables to support the features above:
`profiles`, `listings`, `utility_costs`, `items` (Exchange), `offers`, `bills`, `bill_payments`, `reviews`, `seeking_posts`, `messages`, `notifications`, `verifications`, `complaints`, `watchlist`, `zones`.

---
*Generated based on project features and structure. Last updated: September 2026.*
