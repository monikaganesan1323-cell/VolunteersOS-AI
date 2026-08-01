// Cross-platform dev launcher for the VOLUNTEER portal.
// Sets PORT before Next.js loads its config, so next.config.js can
// reliably pick a separate build cache (.next-portal) from the admin app.
process.env.PORT = "3001";

const { spawn } = require("child_process");

const child = spawn("npx", ["next", "dev", "-p", "3001"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
