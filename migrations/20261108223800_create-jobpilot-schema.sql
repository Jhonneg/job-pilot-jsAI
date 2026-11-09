CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  current_title TEXT,
  experience_level TEXT,
  years_experience INTEGER CHECK (years_experience IS NULL OR years_experience >= 0),
  skills TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  industries TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  work_experience JSONB NOT NULL DEFAULT '[]'::JSONB,
  education JSONB NOT NULL DEFAULT '{}'::JSONB,
  job_titles_seeking TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  remote_preference TEXT,
  preferred_locations TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  salary_expectation TEXT,
  cover_letter_tone TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  work_authorization TEXT,
  resume_pdf_url TEXT,
  resume_pdf_key TEXT,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  job_title_searched TEXT NOT NULL,
  location_searched TEXT NOT NULL DEFAULT '',
  jobs_found INTEGER NOT NULL DEFAULT 0 CHECK (jobs_found >= 0),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE (id, user_id)
);

CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('search', 'url')),
  source_url TEXT NOT NULL,
  external_apply_url TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT,
  job_type TEXT,
  about_role TEXT,
  responsibilities TEXT[],
  requirements TEXT[],
  nice_to_have TEXT[],
  benefits TEXT[],
  about_company TEXT,
  match_score INTEGER NOT NULL DEFAULT 0 CHECK (match_score BETWEEN 0 AND 100),
  match_reason TEXT,
  matched_skills TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  missing_skills TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  company_research JSONB,
  found_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  company_researched_at TIMESTAMPTZ,
  UNIQUE (id, user_id),
  CONSTRAINT jobs_run_owner_fk
    FOREIGN KEY (run_id, user_id)
    REFERENCES public.agent_runs(id, user_id)
    ON DELETE CASCADE
);

CREATE TABLE public.agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'success', 'warning', 'error')),
  job_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT agent_logs_run_owner_fk
    FOREIGN KEY (run_id, user_id)
    REFERENCES public.agent_runs(id, user_id)
    ON DELETE CASCADE,
  CONSTRAINT agent_logs_job_owner_fk
    FOREIGN KEY (job_id, user_id)
    REFERENCES public.jobs(id, user_id)
    ON DELETE CASCADE
);

CREATE INDEX agent_runs_user_started_idx
  ON public.agent_runs (user_id, started_at DESC, id DESC);
CREATE INDEX jobs_user_score_idx
  ON public.jobs (user_id, match_score DESC, id DESC);
CREATE INDEX jobs_user_found_idx
  ON public.jobs (user_id, found_at DESC, id DESC);
CREATE INDEX jobs_user_researched_idx
  ON public.jobs (user_id, company_researched_at DESC, id DESC);
CREATE INDEX jobs_run_idx
  ON public.jobs (run_id);
CREATE INDEX agent_logs_user_created_idx
  ON public.agent_logs (user_id, created_at DESC, id DESC);
CREATE INDEX agent_logs_run_idx
  ON public.agent_logs (run_id);

CREATE OR REPLACE FUNCTION public.prevent_profile_id_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'profile id cannot be changed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.prevent_owner_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'owner id cannot be changed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_prevent_id_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_id_change();

CREATE TRIGGER agent_runs_prevent_owner_change
  BEFORE UPDATE ON public.agent_runs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_owner_change();

CREATE TRIGGER jobs_prevent_owner_change
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_owner_change();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO authenticated;
REVOKE ALL ON public.profiles, public.agent_runs, public.jobs, public.agent_logs FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles, public.agent_runs, public.jobs TO authenticated;
GRANT SELECT, INSERT ON public.agent_logs TO authenticated;
REVOKE UPDATE, DELETE ON public.agent_logs FROM authenticated;

CREATE POLICY profiles_owner_select ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));
CREATE POLICY profiles_owner_insert ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));
CREATE POLICY profiles_owner_update ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));
CREATE POLICY profiles_owner_delete ON public.profiles
  FOR DELETE TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY agent_runs_owner_select ON public.agent_runs
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY agent_runs_owner_insert ON public.agent_runs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY agent_runs_owner_update ON public.agent_runs
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY agent_runs_owner_delete ON public.agent_runs
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY jobs_owner_select ON public.jobs
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY jobs_owner_insert ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY jobs_owner_update ON public.jobs
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY jobs_owner_delete ON public.jobs
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY agent_logs_owner_select ON public.agent_logs
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY agent_logs_owner_insert ON public.agent_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;

CREATE POLICY resumes_owner_select ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket = 'resumes'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );

CREATE POLICY resumes_owner_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket = 'resumes'
    AND uploaded_by = (SELECT auth.jwt() ->> 'sub')
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );

CREATE POLICY resumes_owner_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket = 'resumes'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  )
  WITH CHECK (
    bucket = 'resumes'
    AND uploaded_by = (SELECT auth.jwt() ->> 'sub')
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );

CREATE POLICY resumes_owner_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket = 'resumes'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );
