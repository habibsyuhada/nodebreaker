import type { LevelDef } from "./types";

export const LEVEL_01: LevelDef = {
  id: "level-01",
  index: 0,
  title: "Neighbor's Router",
  briefing: [
    "Connection established.",
    "Target: unsecured router on the local subnet.",
    "No intrusion detection on this device. Take your time.",
  ],
  entryNodeId: "router",
  successText: ["ACCESS GRANTED.", "You're in — admin panel unlocked.", "LEVEL 1 COMPLETE."],
  nodes: [
    {
      id: "router",
      ip: "192.168.1.1",
      orgName: "Private Residence — Apt 4B",
      traceEnabled: false,
      ports: [
        {
          port: 80,
          service: "http",
          banner:
            "RealTek RTL-WR840N | Web Admin [[version:v1.2|Router firmware version]] (default firmware)",
        },
      ],
      users: [{ username: "admin", password: "admin", role: "admin" }],
      systemUsers: [],
      quickLogin: {
        requiredFacts: ["read-notes"],
        username: "admin",
        password: "admin",
        label: "Login (admin/admin — factory default)",
      },
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "system",
            kind: "dir",
            children: [
              {
                name: "dhcp_leases.log",
                kind: "file",
                content:
                  "192.168.1.14  AA:BB:CC:11:22:33  [[pattern:living-room-tv|DHCP hostname]]\n192.168.1.23  AA:BB:CC:44:55:66  [[username:johns-laptop|DHCP hostname — possible username]]",
              },
            ],
          },
          {
            name: "notes.txt",
            kind: "file",
            grantsFact: "read-notes",
            content:
              "Reminder to self:\n\nStill haven't logged into the router admin panel to change\nanything since the ISP tech set it up. Everything's probably\nstill on whatever it shipped with out of the box.\n\n- M",
          },
          {
            name: "firmware.bin",
            kind: "file",
            readable: false,
          },
        ],
      },
    },
  ],
};
