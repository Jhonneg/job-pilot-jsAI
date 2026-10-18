import project from "../../.insforge/project.json";

export const INSFORGE_BASE_URL =
  process.env.NEXT_PUBLIC_INSFORGE_URL ?? project.oss_host;

export const INSFORGE_ANON_KEY =
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ??
  "anon_795cf12b90d1be49dd854a78ea9d0c948886e53ec758efbba08bf3a6c28fc085";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
