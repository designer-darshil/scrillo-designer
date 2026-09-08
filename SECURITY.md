# SCRiLLO Admin Security & Access Control Architecture

## 1. Overview & Core Security Principles

The SCRiLLO administration and portfolio platform implements a multi-layered security architecture with **Supabase Row Level Security (RLS)**, **Role-Based Access Control (RBAC)**, and **Client-Side Permission Guards**.

### Core Tenets:
1. **Explicit Role Assignment**: No authenticated user is automatically treated as an administrator. Newly registered accounts start in a restricted `viewer` mode with zero administrative or editorial privileges.
2. **Draft & State Protection**: Unauthenticated public visitors can only read published (`published = true`, `visible = true`) content. Unfinished working drafts remain protected.
3. **Destructive Operation Protection**: Destructive operations (such as permanently deleting projects, categories, services, or media files) and publication to the live website are strictly restricted to the `admin` role.
4. **Credential Isolation**: Only the public `VITE_SUPABASE_ANON_KEY` is bundled in the frontend client. The high-privilege `SUPABASE_SERVICE_ROLE_KEY` is **never** exposed in client source code.

---

## 2. Role Structure & Permissions Matrix

| Permission / Action | Admin | Editor | Viewer / Public |
| :--- | :---: | :---: | :---: |
| **View Published Website Content** | ✅ | ✅ | ✅ |
| **View Working Draft Content** | ✅ | ✅ | ❌ |
| **Manage / Edit Projects & Case Studies** | ✅ | ✅ | ❌ |
| **Manage / Edit Skills & Capabilities** | ✅ | ✅ | ❌ |
| **Manage / Edit Services Scope** | ✅ | ✅ | ❌ |
| **Manage / Edit Editorial Content (Copy)** | ✅ | ✅ | ❌ |
| **Upload Media Assets (CDN)** | ✅ | ✅ | ❌ |
| **System Settings (`/admin/settings`)** | ✅ | ❌ *(Access Denied)* | ❌ *(Access Denied)* |
| **Publish Working Draft to Live Site** | ✅ | ❌ *(Admin Only)* | ❌ |
| **Permanently Delete Records** | ✅ | ❌ *(Admin Only)* | ❌ |
| **Delete Storage Files from Bucket** | ✅ | ❌ *(Admin Only)* | ❌ |
| **Promote / Assign User Roles** | ✅ | ❌ | ❌ |

---

## 3. Database Security & Row Level Security (RLS) Policies

All database tables have **Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)**. Database policies are defined in [`supabase/security_hardening_rls.sql`](file:///Users/jarvis/Documents/scrillo/supabase/security_hardening_rls.sql).

### 3.1 `profiles` Table
- **Schema**: `id (UUID PK)`, `email (TEXT)`, `role (TEXT CHECK IN ('admin', 'editor', 'viewer'))`, `display_name (TEXT)`, `avatar_url (TEXT)`.
- **Trigger**: `on_auth_user_created` automatically creates a profile row with `role = 'viewer'`.
- **Policies**:
  - `SELECT`: Users can view their own profile; Admins can view all profiles.
  - `UPDATE`: Only Admins (`public.is_admin()`) can modify user roles.
  - `DELETE`: Only Admins can delete user profiles.

### 3.2 `projects` Table
- **Policies**:
  - `SELECT`: Public can only view records where `published = true`. Editors and Admins (`public.is_editor_or_admin()`) can view all drafts.
  - `INSERT`: Allowed for authenticated `editor` and `admin`.
  - `UPDATE`: Allowed for authenticated `editor` and `admin`.
  - `DELETE`: Restricted strictly to `admin` (`public.is_admin()`).

### 3.3 `services` & `skills` Tables
- **Policies**:
  - `SELECT`: Public can only view records where `visible = true`. Editors and Admins can view all records.
  - `INSERT` & `UPDATE`: Allowed for `editor` and `admin`.
  - `DELETE`: Restricted strictly to `admin`.

### 3.4 `website_content` Table
- **Policies**:
  - `SELECT`: Public can view records where `version = 'published'`. Editors and Admins can view draft records.
  - `UPDATE`: Allowed for `editor` and `admin` on draft versions.
  - `INSERT` (Publish): Controlled publication workflow.

### 3.5 `website_settings` Table
- **Policies**:
  - `SELECT`: Public can view global theme and SEO settings.
  - `UPDATE`: Restricted strictly to `admin` (`public.is_admin()`). Editors cannot alter core system configuration, tracking IDs, or theme tokens.

### 3.6 `media_assets` Table
- **Policies**:
  - `SELECT`: Public can view asset metadata.
  - `INSERT`: Allowed for `editor` and `admin`.
  - `DELETE`: Restricted strictly to `admin`.

---

## 4. Supabase Storage Policies (`media` Bucket)

The `media` storage bucket hosts all project photography, vector assets, and portfolio specimens:
1. **Public Read CDN (`storage.objects SELECT`)**:
   - `bucket_id = 'media'` (Publicly accessible for fast image delivery).
2. **Editor / Admin Upload (`storage.objects INSERT`)**:
   - `bucket_id = 'media' AND public.is_editor_or_admin()` (Requires valid authenticated Editor or Admin session).
3. **Editor / Admin Update (`storage.objects UPDATE`)**:
   - `bucket_id = 'media' AND public.is_editor_or_admin()`.
4. **Admin-Only Deletion (`storage.objects DELETE`)**:
   - `bucket_id = 'media' AND public.is_admin()` (Prevents accidental or unauthorized asset loss).

---

## 5. Auth UX & Access Denied Implementation

When an authenticated user lacks the required permission:
- The system **never fails silently**.
- Renders the dedicated [`AccessDenied.tsx`](file:///Users/jarvis/Documents/scrillo/src/admin/pages/AccessDenied.tsx) view with:
  - Clear **HTTP 403 Forbidden** security clearance explanation.
  - Displays authenticated email and currently assigned role.
  - Quick action buttons to **Sign Out** or **Return to Portfolio**.
- Routes like `/admin/settings` are guarded by `<ProtectedRoute requiredRole="admin">`.

---

## 6. How to Promote an Initial Administrator

To bootstrap an initial administrator account in your Supabase project:

1. Register/Sign in with your email address in Supabase Auth.
2. Open the **Supabase SQL Editor** and execute:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-admin-email@example.com';
   ```
3. To assign an Editor role:
   ```sql
   UPDATE public.profiles
   SET role = 'editor'
   WHERE email = 'editor-email@example.com';
   ```
