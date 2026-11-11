# Latch Supabase backend

Connected project: `lzcuhmszshahknmdmezl` in EU West (Ireland).

The existing MarcheseCRM database was repurposed with the owner's explicit permission. Schema migration `20261111223858_initialize_latch_platform` was applied on the connected database and built 10 Row Level Security protected tables, a private `latch-photos` storage bucket, and matching/notification triggers. The initial migration is currently in Supabase's remote migration history; **pull a schema snapshot before cloning to a new database**.

A follow-up patch `20261111230605_enforce_international_discovery_opt_in.sql` is stored here and was also applied remotely.

Do not replay legacy MarcheseCRM migrations or delete accounts on a future deployment. Review policies and sign-in configuration before enabling public signups.
