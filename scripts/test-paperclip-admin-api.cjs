function requireEnv(name) {
  const value = process.env[name] ? String(process.env[name]).trim() : "";
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

async function readBody(response) {
  const text = await response.text().catch(() => "");
  if (!text) return "";

  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

async function main() {
  const response = await fetch(`${getBaseUrl()}/api/admin/applications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const body = await readBody(response);
    console.error(`HTTP status: ${response.status}`);
    console.error(`error message: GET /api/admin/applications failed`);
    console.error(`response body: ${body || "(empty)"}`);
    process.exitCode = 1;
    return;
  }

  const payload = await response.json().catch(() => null);
  if (!payload || payload.ok !== true || !Array.isArray(payload.applications)) {
    console.error(`HTTP status: ${response.status}`);
    console.error("error message: Unexpected admin API response shape");
    console.error(`response body: ${JSON.stringify(payload, null, 2)}`);
    process.exitCode = 1;
    return;
  }

  const applications = payload.applications;
  const first = applications[0] || null;

  console.log(`status: ${response.status}`);
  console.log(`application count: ${applications.length}`);
  console.log(`first application id: ${first ? first.id : "(none)"}`);
  console.log(`first application target level: ${first ? first.target_level : "(none)"}`);
  console.log(`first application status: ${first ? first.status : "(none)"}`);
  console.log(`first application review status: ${first ? first.review_status : "(none)"}`);
  console.log(`first application certificate status: ${first ? first.certificate_status : "(none)"}`);
}

main().catch((error) => {
  console.error("HTTP status: n/a");
  console.error(`error message: ${error instanceof Error ? error.message : String(error)}`);
  console.error("response body: (request not completed)");
  process.exitCode = 1;
});
