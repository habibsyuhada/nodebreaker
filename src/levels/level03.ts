import type { LevelDef } from "./types";

export const LEVEL_03: LevelDef = {
  id: "level-03",
  index: 2,
  title: "Ledger & Co. Accounting",
  briefing: [
    "Connection established.",
    "Target: a small accounting firm's file server.",
    "This one has monitoring. TRACE will climb the longer you linger —",
    "get in, get what you need, and cover your tracks before you go.",
  ],
  entryNodeId: "ledger-srv",
  successText: ["ACCESS GRANTED.", "You're in — file server unlocked.", "LEVEL 3 COMPLETE."],
  completionRequires: ["logs-deleted"],
  nodes: [
    {
      id: "ledger-srv",
      ip: "198.51.100.15",
      orgName: "Ledger & Co. Accounting",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 7.4 | Ubuntu 18.04 accounting-srv" }],
      users: [{ username: "jmartin", password: "Ledger#2024", role: "accountant" }],
      systemUsers: [
        { username: "admin", role: "sysadmin" },
        { username: "jmartin", role: "accountant" },
        { username: "backup-svc", role: "service account" },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "var",
            kind: "dir",
            children: [
              {
                name: "log",
                kind: "dir",
                children: [
                  {
                    name: "access.log",
                    kind: "file",
                    grantsFact: "read-access-log",
                    content:
                      "2024-01-14 09:02  [[username:jmartin|Account name flagged in the log]] login OK  from 10.0.0.14 (internal)\n2024-01-14 09:15  jmartin login OK  from 10.0.0.14 (internal)\n2024-01-15 02:47  jmartin login OK  from 185.23.44.109 (unrecognized) — [[pattern:2:47am from an unrecognized host|Suspicious: this session doesn't look like jmartin]]\n2024-01-15 02:49  jmartin ran: mysqldump ledger_db > export.sql",
                  },
                ],
              },
            ],
          },
          {
            name: "home",
            kind: "dir",
            children: [
              {
                name: "jmartin",
                kind: "dir",
                children: [
                  {
                    name: ".bash_history",
                    kind: "file",
                    grantsFact: "read-history",
                    content:
                      "cd /var/www/ledger\nls -la\nmysql -u jmartin -p'[[password:Ledger#2024|Password typed straight into the shell]]' ledger_db\nexit",
                  },
                ],
              },
            ],
          },
          {
            name: "README.txt",
            kind: "file",
            content: "Ledger & Co. file server. IT ticket #4471: renew the SSH host key (still pending).",
          },
        ],
      },
    },
  ],
};
