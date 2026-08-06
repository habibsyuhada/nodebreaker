import type { LevelDef } from "./types";

export const LEVEL_06: LevelDef = {
  id: "level-06",
  index: 5,
  title: "Fleetline Logistics",
  briefing: [
    "Connection established.",
    "Target: a regional shipping company's ops server.",
    "Something here looks too easy to grab. Look before you touch anything.",
  ],
  entryNodeId: "fleetline-srv",
  successText: ["ACCESS GRANTED.", "You're in — logistics ops console unlocked.", "LEVEL 6 COMPLETE."],
  nodes: [
    {
      id: "fleetline-srv",
      ip: "203.0.113.88",
      orgName: "Fleetline Logistics",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.9 | fleetline-ops-srv" }],
      users: [{ username: "mdrake", password: "Fr8Handl3r!", role: "ops" }],
      systemUsers: [
        { username: "mdrake", role: "ops" },
        { username: "root", role: "admin" },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "README.txt",
            kind: "file",
            content: "Fleetline Logistics ops server. Contact IT before changing anything.",
          },
          {
            name: "payroll_export",
            kind: "dir",
            metadata: [
              { label: "owner", value: "security-ops" },
              { label: "modified", value: "3 minutes ago" },
              { label: "note", value: "access-monitored directory" },
            ],
            honeypot: {
              tracePenalty: 35,
              triggeredFact: "honeypot-triggered",
              warningText: [
                "[alert] intrusion sensor tripped in /payroll_export",
                "[alert] directory access logged and escalated to security-ops",
              ],
            },
            children: [
              {
                name: "notes.txt",
                kind: "file",
                content:
                  "Backup admin access — [[password:Payr0ll2024!|Found in the payroll backup folder]]",
              },
            ],
          },
          {
            name: "var",
            kind: "dir",
            children: [
              {
                name: "log",
                kind: "dir",
                children: [
                  {
                    name: "app_error.log",
                    kind: "file",
                    grantsFact: "read-error-log",
                    content:
                      "Traceback (most recent call last):\n" +
                      '  File "sync.py", line 88, in <module>\n' +
                      "    raise IOError(\"cannot resolve fallback path\")\n" +
                      "IOError: fallback dir missing: " +
                      "[[path:/mnt/archive/manifests_2024|Real data path, leaked in an app error stack trace]]",
                  },
                ],
              },
            ],
          },
          {
            name: "mnt",
            kind: "dir",
            children: [
              {
                name: "archive",
                kind: "dir",
                children: [
                  {
                    name: "manifests_2024",
                    kind: "dir",
                    children: [
                      {
                        name: "ops_handoff.txt",
                        kind: "file",
                        grantsFact: "read-handoff",
                        content:
                          "Ops handoff — shift notes.\n\n" +
                          "If the sync job fails again, log in manually:\n" +
                          "[[username:mdrake|Ops account, mentioned in handoff notes]] / " +
                          "[[password:Fr8Handl3r!|Temporary password, meant to be rotated but wasn't]]",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
};
