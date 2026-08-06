import type { LevelDef } from "./types";

export const LEVEL_05: LevelDef = {
  id: "level-05",
  index: 4,
  title: "Riverside Health",
  briefing: [
    "Connection established.",
    "Target: Riverside Health.",
    "The patient portal is public-facing — the real records live somewhere else.",
  ],
  entryNodeId: "riverside-public",
  successText: ["ACCESS GRANTED.", "You're in — internal ops dashboard unlocked.", "LEVEL 5 COMPLETE."],
  nodes: [
    {
      id: "riverside-public",
      ip: "203.0.113.55",
      orgName: "Riverside Health — Patient Portal",
      traceEnabled: false,
      ports: [{ port: 443, service: "https", banner: "nginx 1.20 | Riverside Health public patient portal" }],
      users: [],
      systemUsers: [],
      pivots: [
        {
          id: "to-internal",
          targetNodeId: "riverside-internal",
          label: "Pivot to 192.168.20.5",
          requiredFacts: ["found-internal-ip"],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "about.txt",
            kind: "file",
            content:
              "Riverside Health patient portal.\nBook appointments, view test results, message your care team.",
          },
          {
            name: "contact.txt",
            kind: "file",
            grantsFact: "read-staff-contacts",
            content:
              "Need help logging into the patient app?\n\n" +
              "IT Support — [[username:jwilson|Also used for internal systems]] / " +
              "[[email:jwilson@riversidehealth.org|IT support contact — listed on several public pages]]\n" +
              "Front Desk — reception@riversidehealth.org\n" +
              "Billing — billing@riversidehealth.org",
          },
          {
            name: "robots.txt",
            kind: "file",
            grantsFact: "found-internal-ip",
            content:
              "User-agent: *\n" +
              "Disallow: /admin\n" +
              "Disallow: /patient-portal/internal\n" +
              "# TODO: retire link to the legacy ops dashboard " +
              "([[path:192.168.20.5|Leftover internal IP, left in a public robots.txt]]) once migration finishes",
          },
        ],
      },
    },
    {
      id: "riverside-internal",
      ip: "192.168.20.5",
      orgName: "Riverside Health — Internal Ops",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.4 | ops-dashboard (internal, staff VPN only)" }],
      users: [{ username: "jwilson", password: "Sunshine88!", role: "IT admin" }],
      systemUsers: [
        { username: "jwilson", role: "IT admin" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-public",
          targetNodeId: "riverside-public",
          label: "Pivot to 203.0.113.55",
          requiredFacts: [],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "README.txt",
            kind: "file",
            content:
              "Internal ops dashboard. Authorized hospital staff only.\nContact IT if you've lost access.",
          },
        ],
      },
    },
  ],
};
