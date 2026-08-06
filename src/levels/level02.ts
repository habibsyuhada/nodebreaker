import type { LevelDef } from "./types";

export const LEVEL_02: LevelDef = {
  id: "level-02",
  index: 1,
  title: "Online Storefront",
  briefing: [
    "Connection established.",
    "Target: a small online store's admin backend.",
    "No login page shortcuts here — you'll need to earn the credentials.",
  ],
  entryNodeId: "storefront",
  successText: ["ACCESS GRANTED.", "You're in — storefront admin unlocked.", "LEVEL 2 COMPLETE."],
  nodes: [
    {
      id: "storefront",
      ip: "203.0.113.42",
      orgName: "Boutique '98 Online Store",
      traceEnabled: false,
      ports: [{ port: 443, service: "https", banner: "nginx 1.18 | Storefront CMS admin login" }],
      users: [{ username: "sarahk", password: "sarah1998", role: "owner" }],
      systemUsers: [],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "about-us.txt",
            kind: "file",
            content:
              "Little shop, big heart.\n\nBoutique '98 was started back when getting online at all felt\nlike magic. Fun fact: the very first admin handle around here\nwas literally just the owner's name and the year —\n[[pattern:sarah1998|Owner's name + founding year, an old admin handle]] —\nfrom back when nobody worried much about security.",
          },
          {
            name: "products.csv",
            kind: "file",
            content:
              "sku,name,price\nBOU-001,Hand-knit scarf,24.00\nBOU-002,Ceramic mug,14.50\nBOU-003,Tote bag,18.00",
          },
          {
            name: "backup",
            kind: "dir",
            children: [
              {
                name: "README.txt",
                kind: "file",
                content:
                  "Nightly backups land here automatically.\nRemember to purge old admin exports once you're done with them.",
              },
              {
                name: "users_backup.csv",
                kind: "file",
                content:
                  "export_date,admin_user,last_login\n2019-03-01,[[username:sarahk|Backup admin username]],2019-02-27",
              },
            ],
          },
        ],
      },
    },
  ],
};
