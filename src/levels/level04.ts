import type { LevelDef } from "./types";

export const LEVEL_04: LevelDef = {
  id: "level-04",
  index: 3,
  title: "Nimbus Startup",
  briefing: [
    "Connection established.",
    "Target: a startup's staging deploy box.",
    "Nothing here is guarded well, but nothing is handed to you either —",
    "decode, compare, and crack your way in.",
  ],
  entryNodeId: "nimbus-app",
  successText: ["ACCESS GRANTED.", "You're in — deploy pipeline unlocked.", "LEVEL 4 COMPLETE."],
  nodes: [
    {
      id: "nimbus-app",
      ip: "203.0.113.201",
      orgName: "Nimbus Systems",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.2 | nimbus-app (staging)" }],
      users: [{ username: "deploy-bot", password: "Aut0Deploy#9", role: "deployment service account" }],
      systemUsers: [
        { username: "deploy-bot", role: "service account" },
        { username: "root", role: "admin" },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "src",
            kind: "dir",
            children: [
              {
                name: "deploy.py",
                kind: "file",
                grantsFact: "read-deploy-script",
                content:
                  "# main deploy script — don't touch without asking platform team\n" +
                  "# legacy service login moved here during the migration\n" +
                  "# b64: [[encoded:ZGVwbG95LWJvdA==|Base64 comment left in by a careless dev]]\n" +
                  "import subprocess\n\n" +
                  'def deploy():\n    subprocess.run(["./push.sh"])\n',
              },
            ],
          },
          {
            name: "etc",
            kind: "dir",
            children: [
              {
                name: "config.old.yml",
                kind: "file",
                grantsFact: "read-config-old",
                content:
                  "service: nimbus-app\n" +
                  "username: deploy-bot\n" +
                  "password_hash: [[hash:5f4dcc3b5aa765d61d8327deb882cf99|Old hash — superseded]]\n" +
                  "updated: 2023-11-02",
              },
              {
                name: "config.new.yml",
                kind: "file",
                grantsFact: "read-config-new",
                content:
                  "service: nimbus-app\n" +
                  "username: deploy-bot\n" +
                  "password_hash: [[hash:9f86d081884c7d659a2feaa0c55ad015|New hash after last rotation]]\n" +
                  "updated: 2024-06-18",
              },
            ],
          },
          {
            name: "README.txt",
            kind: "file",
            content:
              "Nimbus Systems staging deploy box.\nIf access breaks, check with the platform team before touching creds.",
          },
        ],
      },
      compares: [
        {
          id: "configs",
          label: "Compare Configs",
          pathA: ["etc", "config.old.yml"],
          pathB: ["etc", "config.new.yml"],
          requiredFacts: ["read-config-old", "read-config-new"],
          grantsFact: "compared-configs",
        },
      ],
    },
  ],
};
