import { appendFileSync } from "node:fs";

const rawBindings = process.env.CLOUD_MAIL_BINDINGS;
if (!rawBindings) {
  throw new Error("Set CLOUD_MAIL_BINDINGS in the Cloudflare build environment.");
}

const { d1, kv } = JSON.parse(rawBindings);
if (
  typeof d1 !== "string" ||
  !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(d1) ||
  typeof kv !== "string" ||
  !/^[a-f0-9]{32}$/i.test(kv)
) {
  throw new Error("CLOUD_MAIL_BINDINGS must contain valid D1 and KV resource IDs.");
}

appendFileSync(
  new URL("../wrangler.toml", import.meta.url),
  `
[[d1_databases]]
binding = "db"
database_name = "cloud-mail-db"
database_id = "${d1}"

[[kv_namespaces]]
binding = "kv"
id = "${kv}"
`,
);
