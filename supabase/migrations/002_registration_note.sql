alter table registrations
  add column if not exists note text not null default '';

create index if not exists registrations_status_idx on registrations(status);
