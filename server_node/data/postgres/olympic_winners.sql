DROP TABLE IF EXISTS public.base;

CREATE TABLE IF NOT EXISTS public.base
(
   sys_id uuid NOT NULL DEFAULT uuid_generate_v1(),
   sys_created_at timestamp NOT NULL DEFAULT current_timestamp,
   sys_updated_at timestamp NOT NULL DEFAULT current_timestamp,
	CONSTRAINT base_pkey PRIMARY KEY (sys_id)
)

TABLESPACE pg_default;

CREATE OR REPLACE FUNCTION set_sys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.sys_updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TABLE IF EXISTS public.olympic_winners;

CREATE TABLE IF NOT EXISTS public.olympic_winners
(
    age smallint,
    athlete character varying(20) COLLATE pg_catalog."default",
    country character varying(20) COLLATE pg_catalog."default",
    country_group character varying(2) COLLATE pg_catalog."default",
    year smallint,
    date date,
    sport character varying(20) COLLATE pg_catalog."default",
    gold smallint,
    silver smallint,
    bronze smallint,
    total smallint,
	CONSTRAINT olympic_winners_pkey PRIMARY KEY (sys_id)
) INHERITS (public.base)

TABLESPACE pg_default;

ALTER TABLE public.olympic_winners
    OWNER to roen;

CREATE TRIGGER set_olympic_winners_sys_updated_at BEFORE UPDATE
    ON olympic_winners FOR EACH ROW EXECUTE PROCEDURE 
    set_sys_updated_at();