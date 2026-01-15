# Mementa

## Database Migration Note

**IMPORTANT:** System public quotes must use `user_id`:
```
'00000000-0000-0000-0000-000000000000'
```

All global/system quotes shared across all users must be owned by this system user ID. User-specific quotes use the actual user's ID.

---

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```


