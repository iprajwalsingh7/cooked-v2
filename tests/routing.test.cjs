const { test } = require("node:test");
const assert = require("node:assert/strict");
const config = require("../next.config.js");

async function withEnv(values, run) {
  const previous = {};
  for (const key of Object.keys(values)) {
    previous[key] = process.env[key];
    if (values[key] === undefined) delete process.env[key];
    else process.env[key] = values[key];
  }
  try { await run(); } finally {
    for (const key of Object.keys(values)) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
}

test("Vercel routes every API endpoint to the bundled Python function", async () => {
  await withEnv({ VERCEL: "1", API_BACKEND_URL: undefined }, async () => {
    const rules = await config.rewrites();
    assert.deepEqual(rules, [{ source: "/api/:path+", destination: "/api/" }]);
    assert.ok(!JSON.stringify(rules).includes("127.0.0.1"));
  });
});

test("Vercel ignores a stale private backend override", async () => {
  await withEnv({ VERCEL: "1", API_BACKEND_URL: "http://127.0.0.1:8000" }, async () => {
    assert.equal((await config.rewrites())[0].destination, "/api/");
  });
});

test("local development still proxies to the local FastAPI server", async () => {
  await withEnv({ VERCEL: undefined, API_BACKEND_URL: undefined }, async () => {
    assert.equal((await config.rewrites())[0].destination, "http://127.0.0.1:8000/api/:path*");
  });
});

test("self-hosted installations can select their backend", async () => {
  await withEnv({ VERCEL: undefined, API_BACKEND_URL: "https://api.cooked.test/" }, async () => {
    assert.equal((await config.rewrites())[0].destination, "https://api.cooked.test/api/:path*");
  });
});
