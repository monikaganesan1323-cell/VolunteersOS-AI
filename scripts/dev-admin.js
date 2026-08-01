// Cross-platform dev launcher for the ADMIN portal.
// Sets PORT before Next.js loads its config, so next.config.js can
// reliably pick a separate build cache (.next) from the volunteer portal.
process.env.PORT = "3000";

const { spawn } = require("child_process");

const child = spawn("npx", ["next", "dev", "-p", "3000"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
