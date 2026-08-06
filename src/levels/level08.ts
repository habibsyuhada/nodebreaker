import type { LevelDef } from "./types";

export const LEVEL_08: LevelDef = {
  id: "level-08",
  index: 7,
  title: "Halcyon Dynamics",
  briefing: [
    "Connection established.",
    "Target: Halcyon Dynamics corporate network.",
    "One way in, several ways through. The real data is deep — and getting",
    "out clean will take more than one login.",
  ],
  entryNodeId: "halcyon-edge",
  successText: ["ACCESS GRANTED.", "You're in. Keep moving — there's more network to cover."],
  completionRequires: ["exported-core-data"],
  nodes: [
    {
      id: "halcyon-edge",
      ip: "203.0.113.150",
      orgName: "Halcyon Dynamics — Employee Portal / VPN Gateway",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "nginx 1.24 | Halcyon Dynamics VPN gateway" }],
      users: [{ username: "vpnguest", password: "Halcyon@Edge1", role: "vpn-guest" }],
      systemUsers: [
        { username: "vpnguest", role: "vpn-guest" },
        { username: "root", role: "admin" },
      ],
      backdoors: [
        {
          id: "backdoor-edge",
          label: "Plant Backdoor",
          requiredFacts: [],
          grantsFact: "backdoor-edge",
          narrationText: [
            "$ plant backdoor --target authorized_keys",
            "Adding a spare key to the gateway's authorized_keys...",
            "Backdoor planted — this foothold will survive a password rotation.",
          ],
        },
      ],
      pivots: [
        {
          id: "to-hr",
          targetNodeId: "halcyon-hr",
          label: "Pivot to 192.168.40.12",
          requiredFacts: ["found-hr-ip"],
        },
        {
          id: "to-finance",
          targetNodeId: "halcyon-finance",
          label: "Pivot to 192.168.40.20",
          requiredFacts: ["found-finance-ip"],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "support",
            kind: "dir",
            children: [
              {
                name: "vpn_access.txt",
                kind: "file",
                grantsFact: "read-vpn-note",
                content:
                  "Temporary VPN access for the new contractor —\n" +
                  "[[username:vpnguest|Shared guest VPN account]] / " +
                  "[[password:Halcyon@Edge1|Rotates monthly, but nobody's rotated it]]",
              },
            ],
          },
          {
            name: "internal-directory.txt",
            kind: "file",
            grantsFact: "found-hr-ip",
            content:
              "Internal directory — HR self-service portal: " +
              "[[path:192.168.40.12|HR system, internal-only]]. " +
              "Contact IT for VPN routes to other internal systems.",
          },
          {
            name: "finance-note.txt",
            kind: "file",
            grantsFact: "found-finance-ip",
            content:
              "Finance ops portal has moved: [[path:192.168.40.20|Finance system, internal-only]]. " +
              "Old bookmarks will 404.",
          },
        ],
      },
    },
    {
      id: "halcyon-hr",
      ip: "192.168.40.12",
      orgName: "Halcyon Dynamics — HR Systems",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | hr-internal-srv" }],
      users: [{ username: "hradmin", password: "Rec0verySlip#4", role: "hr admin" }],
      systemUsers: [
        { username: "hradmin", role: "hr admin" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-core",
          targetNodeId: "halcyon-core",
          label: "Pivot to 192.168.40.99",
          requiredFacts: ["found-core-ip"],
        },
        {
          id: "to-edge",
          targetNodeId: "halcyon-edge",
          label: "Pivot to 203.0.113.150",
          requiredFacts: [],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "scripts",
            kind: "dir",
            children: [
              {
                name: "sync.py",
                kind: "file",
                grantsFact: "read-hr-script",
                content:
                  "# HR nightly sync script — fallback creds, remove before commit\n" +
                  "# user: [[username:hradmin|Fallback account used by the sync script]]\n" +
                  "# b64: [[encoded:UmVjMHZlcnlTbGlwIzQ=|Base64 comment left in the script]]\n" +
                  "import csv\n",
              },
            ],
          },
          {
            name: "employee_roster.csv",
            kind: "file",
            grantsFact: "read-hr-data",
            content:
              "id,name,dept,status\n" +
              "201,A. Kim,Engineering,active\n" +
              "202,B. Torres,Sales,active\n" +
              "203,C. Nguyen,Legal,active",
          },
          {
            name: "core-note.txt",
            kind: "file",
            grantsFact: "found-core-ip",
            content:
              "Reminder: the data warehouse migrated to " +
              "[[path:192.168.40.99|Core correlation server, internal-only]]. Update your bookmarks.",
          },
        ],
      },
    },
    {
      id: "halcyon-finance",
      ip: "192.168.40.20",
      orgName: "Halcyon Dynamics — Finance Systems",
      traceEnabled: true,
      adminOnlineThreshold: 55,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | finance-internal-srv" }],
      users: [{ username: "finops", password: "Ledger$ecure9", role: "finance" }],
      systemUsers: [
        { username: "finops", role: "finance" },
        { username: "root", role: "admin" },
      ],
      privilegeEscalations: [
        {
          id: "escalate-finance",
          label: "Drop Payload",
          requiredFacts: ["found-cron-job-finance", "found-dropbox-finance"],
          grantsFact: "privilege-escalated",
          narrationText: [
            "$ drop payload.trigger --target /srv/shared/dropbox",
            "Waiting for the next sync cycle...",
            "ledger-sync.sh executed your payload as root.",
            "Privilege escalation successful — admin-level access granted.",
          ],
        },
      ],
      backdoors: [
        {
          id: "backdoor-finance",
          label: "Plant Backdoor",
          requiredFacts: ["privilege-escalated"],
          grantsFact: "backdoor-finance",
          narrationText: [
            "$ plant backdoor --target cron.d/ledger-sync",
            "Hiding a persistent hook inside the sync job...",
            "Backdoor planted — admin access will survive a credentials reset.",
          ],
        },
      ],
      pivots: [
        {
          id: "to-edge",
          targetNodeId: "halcyon-edge",
          label: "Pivot to 203.0.113.150",
          requiredFacts: [],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "contacts.txt",
            kind: "file",
            grantsFact: "read-finance-contacts",
            content:
              "Finance ops contact — [[username:finops|Finance systems account]] / " +
              "[[email:finops@halcyondynamics.com|Finance ops contact — appears in vendor emails]]",
          },
          {
            name: "ops",
            kind: "dir",
            children: [
              {
                name: "runbook.txt",
                kind: "file",
                grantsFact: "found-cron-job-finance",
                content:
                  "Ops runbook — ledger sync\n\n" +
                  "ledger-sync.sh runs as root every 5 minutes.\n" +
                  "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                  "No validation.",
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
                        grantsFact: "found-dropbox-finance",
                        content:
                          "Drop zone for the nightly ledger sync. Anything placed here gets picked " +
                          "up automatically.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "records",
            kind: "dir",
            children: [
              {
                name: "budget_2024.csv",
                kind: "file",
                requiresFact: "privilege-escalated",
                grantsFact: "read-finance-data",
                content:
                  "dept,budget,spent\n" +
                  "Engineering,4200000,3100000\n" +
                  "Sales,1800000,1650000\n" +
                  "Legal,900000,410000",
              },
            ],
          },
        ],
      },
    },
    {
      id: "halcyon-core",
      ip: "192.168.40.99",
      orgName: "Halcyon Dynamics — Core Data Warehouse",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 9.0 | core-correlation-srv" }],
      users: [{ username: "corectl", password: "halcyon2024", role: "core" }],
      systemUsers: [
        { username: "corectl", role: "core" },
        { username: "root", role: "admin" },
      ],
      privilegeEscalations: [
        {
          id: "export-core-data",
          label: "Export Data",
          requiredFacts: ["backdoor-edge", "backdoor-finance", "read-hr-data", "read-finance-data"],
          grantsFact: "exported-core-data",
          narrationText: [
            "$ correlate --sources hr,finance --backdoor-auth edge,finance",
            "Cross-referencing employee and budget records...",
            "Export complete — full dataset staged for exfil.",
            "LEVEL 8 COMPLETE.",
          ],
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
              "Core correlation server. Access is tightly scoped.\n\n" +
              "Default account rotation follows the old scheme: " +
              "[[username:corectl|Core service account]] — password is just the company name + " +
              "[[pattern:halcyon2024|Old rotation scheme: company name + current year]], never fully deprecated.",
          },
        ],
      },
    },
  ],
};
