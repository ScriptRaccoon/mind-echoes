# Mind Echoes

_Capture your thoughts, reflect on your gratitude, and explore your mind, all in one secure space._

<https://mind-echoes.netlify.app>

## Screenshots

<img src="https://github.com/user-attachments/assets/d5ffd7e1-c515-4171-bf0a-116d3cbfe540" width="300" alt="screenshot of the list of echoes in a year" />&nbsp;&nbsp;&nbsp;&nbsp;
<img src="https://github.com/user-attachments/assets/71219b2c-aff0-4409-aa36-2494daba3b2a" width="300" alt="screenshot of the page to create a new echo" />

<br />
 
<img src="https://github.com/user-attachments/assets/8dfb3cc2-40aa-42a8-b44c-98dd0e0da227" width="300" alt="screenshot of an echo in preview" /> &nbsp;&nbsp;&nbsp;&nbsp;
<img src="https://github.com/user-attachments/assets/66a4342a-aa8d-4e1e-9798-af3ee435b6aa" width="300" alt="screenshot of device management on account page" />

## Description

This diary application is built with SvelteKit and SQLite. Diary entries, referred to as "echoes", can be created on a per-day basis. All entries are encrypted at rest in the database. The encryption is currently not zero-knowledge: decryption occurs on the application server using a fixed encryption key (https://github.com/ScriptRaccoon/mind-echoes/issues/1).

The application provides a full overview of all entries, with support for editing and straightforward navigation between days and entries.

User registration is intentionally split into three steps to improve usability. In the final step, users must enter a six-digit verification code sent to their email address. This is one of several account-level security features.

Authentication includes device-based access control. Logins from previously unregistered devices must be confirmed via an email verification link. All registered devices can be managed from the account settings page. Once a device is revoked, it is immediately prevented from making authenticated requests unless it is re-registered and verified. This significantly reduces the attack surface for unauthorized access.

Password resets are handled via time-limited email verification links.

Changing the account email address requires verification of the new address via an email link, while a notification is simultaneously sent to the existing email address. This dual-confirmation flow provides an additional layer of account security.

## Tech

As with most of my projects, external dependencies are kept to a minimum. The application is largely implemented from first principles using SvelteKit and SQLite, without relying on an ORM or a UI component library.

The following third-party libraries are used:

- `@libsql/client` - executes SQL queries against the SQLite database hosted on Turso
- `bcrypt` and `jsonwebtoken` - implement custom authentication and credential handling
- `lucide-svelte` - supplies the icon set
- `my-ua-parser` - generates human-readable device labels
- `nodemailer` - handles email delivery
- `valibot` - performs schema-based validation of all user input
- `@netlify/functions` — runs scheduled background tasks for regular database cleanup

## Database structure

```mermaid
erDiagram
    users {
        id int PK
        username text
        email text
        password_hash text
        email_verified_at text
        disabled int
        created_at text
    }

    devices {
        id text PK
        user_id int FK
        label text
        token_hash text
        created_at text
        verified_at text
        last_login_at text
    }

    entries {
        id int PK
        user_id int FK
        date text
        title_enc text
        content_enc text
        thanks_enc text
        created_at text
    }

    registration_requests {
        id int PK
        code int
        user_id int FK
        created_at text
        expires_at text
    }

    email_change_requests {
        token text PK
        user_id int FK
        new_email text
        created_at text
        expires_at text
    }

    device_verification_requests {
        token text PK
        device_id text FK
        created_at text
        expires_at text
    }

    password_reset_requests {
        token text PK
        user_id int FK
        created_at text
        expires_at text
    }

    users ||--o{ devices : owns
    users ||--o{ entries : writes
    users ||--o{ registration_requests : has
    users ||--o{ email_change_requests : has
    users ||--o{ password_reset_requests : has
    devices ||--o{ device_verification_requests : has
```
