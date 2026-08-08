import type { LevelDef } from "./types";

export const LEVEL_07: LevelDef = {
  id: "level-07",
  index: 6,
  title: "Cityview Records Office",
  briefing: [
    "Connection established.",
    "Target: city records office.",
    "A front-desk account gets you in the door — the real records need admin.",
  ],
  entryNodeId: "cityview-srv",
  successText: [
    "ACCESS GRANTED.",
    "You're in as tholloway — clerk-level access only.",
    "The real records will need more than this.",
  ],
  completionRequires: ["read-citizen-records", "logs-falsified"],
  nodes: [
    {
      id: "cityview-srv",
      ip: "198.51.100.77",
      orgName: "Cityview Municipal Records",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "Apache 2.4 | Cityview records portal" }],
      users: [{ username: "tholloway", password: "CityHall#22", role: "clerk" }],
      systemUsers: [
        { username: "tholloway", role: "clerk" },
        { username: "admin", role: "administrator" },
      ],
      privilegeEscalations: [
        {
          id: "drop-payload",
          label: "Drop Payload",
          requiredFacts: ["found-cron-job", "found-dropbox"],
          grantsFact: "privilege-escalated",
          narrationText: [
            "$ drop payload.trigger --target /srv/shared/dropbox",
            "Waiting for the next sync cycle...",
            "sync-job.sh executed your payload as root.",
            "Privilege escalation successful — admin-level access granted.",
          ],
          requiredFactHints: {
            "found-cron-job": "You don't know what runs as root yet — check the ops runbook.",
            "found-dropbox": "You don't know where to drop the payload yet — check /srv/shared/dropbox.",
          },
        },
      ],
      logFalsification: {
        requiredFacts: ["found-log-template"],
        tracePenaltyReduction: 15,
        label: "Falsify Logs",
      },
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "helpdesk_tickets",
            kind: "dir",
            children: [
              {
                name: "ticket_4482.txt",
                kind: "file",
                grantsFact: "read-ticket",
                content:
                  "Ticket #4482 — password reset for [[username:tholloway|Front-desk clerk account]].\n" +
                  "Temporary password issued: [[password:CityHall#22|Never rotated after reset]]. " +
                  "Ask them to change it (they didn't).",
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
                    name: "README.txt",
                    kind: "file",
                    grantsFact: "found-log-template",
                    content:
                      "Reference format for routine access entries:\n" +
                      "<timestamp> <user> login OK from <internal-ip>\n\n" +
                      "Audit reviews flag anything that doesn't match this pattern — " +
                      "including gaps left by deleted entries.",
                  },
                ],
              },
            ],
          },
          {
            name: "srv",
            kind: "dir",
            children: [
              {
                name: "shared",
                kind: "dir",
                children: [
                  {
                    name: "dropbox",
                    kind: "dir",
                    children: [
                      {
                        name: "README.txt",
                        kind: "file",
                        grantsFact: "found-dropbox",
                        content:
                          "Drop zone for the nightly records sync. Anything placed here gets picked " +
                          "up automatically — see the ops runbook for the schedule.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "ops",
            kind: "dir",
            children: [
              {
                name: "runbook.txt",
                kind: "file",
                grantsFact: "found-cron-job",
                content:
                  "Ops runbook — records sync\n\n" +
                  "sync-job.sh runs as root every 5 minutes.\n" +
                  "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                  "No validation — whatever's in there runs as-is.",
              },
            ],
          },
          {
            name: "records",
            kind: "dir",
            children: [
              {
                name: "citizen_records.csv",
                kind: "file",
                requiresFact: "privilege-escalated",
                grantsFact: "read-citizen-records",
                content:
                  "id,name,ward,status\n" +
                  "0091,J. Alvarez,Ward 3,active\n" +
                  "0092,R. Chen,Ward 1,active\n" +
                  "0093,M. Osei,Ward 4,pending",
              },
            ],
          },
        ],
      },
    },
  ],
};
