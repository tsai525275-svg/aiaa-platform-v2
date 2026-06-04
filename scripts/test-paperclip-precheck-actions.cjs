function readEnv(name) {
  return process.env[name] ? String(process.env[name]).trim() : "";
}

function requireEnv(name) {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getBaseUrl() {
  return requireEnv("AIAA_ADMIN_BASE_URL").replace(/\/$/, "");
}

function getApiKey() {
  return requireEnv("PAPERCLIP_ADMIN_API_KEY");
}

function getTestApplicationId() {
  return requireEnv("TEST_APPLICATION_ID");
}

function allowWriteTest() {
  return readEnv("ALLOW_PAPERCLIP_WRITE_TEST").toLowerCase() === "true";
}

function printDryRunPlan() {
  console.log("mode: dry-run");
  console.log("No POST request was sent.");
  console.log("To enable a real precheck controlled write test, set:");
  console.log("ALLOW_PAPERCLIP_WRITE_TEST=true");
  console.log("TEST_APPLICATION_ID=<application id>");
  console.log("AIAA_ADMIN_BASE_URL=<base url>");
  console.log("PAPERCLIP_ADMIN_API_KEY=<admin api key>");
  console.log("");
  console.log("Example endpoints:");
  console.log("1. POST /api/admin/applications/<id>/revision-required");
  console.log("2. POST /api/admin/applications/<id>/precheck-reject");
  console.log("3. POST /api/admin/applications/<id>/precheck-approve");
  console.log("");
  console.log("Recommended first live test:");
  console.log("- use a designated test application only");
  console.log("- start with revision-required");
  console.log("- verify reviewer_action_id and notification_id");
  console.log("- do not run against real users");
}

async function readBody(response) {
  const text = await response.text().catch(() => "");
  if (!text) return "";

  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

async function postAction(action, body) {
  const response = await fetch(`${getBaseUrl()}/api/admin/applications/${getTestApplicationId()}/${action}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const responseBody = await readBody(response);
  console.log(`action: ${action}`);
  console.log(`http status: ${response.status}`);
  console.log(`response body: ${responseBody || "(empty)"}`);
}

async function main() {
  if (!allowWriteTest()) {
    printDryRunPlan();
    return;
  }

  const action = readEnv("TEST_PRECHECK_ACTION") || "revision-required";
  const note = readEnv("TEST_PRECHECK_NOTE") || "Paperclip controlled write test note.";
  const revisionReason = readEnv("TEST_REVISION_REASON") || "Designated test application is missing evidence.";
  const rejectReason = readEnv("TEST_REJECT_REASON") || "Designated test application is intentionally invalid for testing.";

  const payloadByAction = {
    "revision-required": {
      note,
      revision_reason: revisionReason,
      metadata: {
        source: "scripts/test-paperclip-precheck-actions.cjs",
        dry_run_bypassed: true
      }
    },
    "precheck-reject": {
      note,
      reject_reason: rejectReason,
      metadata: {
        source: "scripts/test-paperclip-precheck-actions.cjs",
        dry_run_bypassed: true
      }
    },
    "precheck-approve": {
      note,
      metadata: {
        source: "scripts/test-paperclip-precheck-actions.cjs",
        dry_run_bypassed: true
      }
    }
  };

  const payload = payloadByAction[action];
  if (!payload) {
    throw new Error(`Unsupported TEST_PRECHECK_ACTION: ${action}`);
  }

  console.log("mode: live-write-test");
  console.log(`test application id: ${getTestApplicationId()}`);
  console.log(`action: ${action}`);
  await postAction(action, payload);
}

main().catch((error) => {
  console.error(`error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
