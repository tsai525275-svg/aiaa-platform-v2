const fs = require('fs');
const path = require('path');

const root = process.cwd();
const flowPath = path.join(root, 'components', 'certification-application-flow.tsx');
const certPath = path.join(root, 'lib', 'supabase', 'certification.ts');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`File not found: ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function addAfterOnce(text, marker, addition) {
  if (text.includes(addition.trim())) return text;
  if (!text.includes(marker)) throw new Error(`Marker not found: ${marker}`);
  return text.replace(marker, marker + addition);
}

let cert = read(certPath);

cert = cert.replace(/(agent_category:\s*string;\r?\n)(?!\s*contact_email:)/g, '$1  contact_email: string;\n');

cert = cert.replace(
  /(agent_category:\s*cleanText\(input\.agent_category\),\r?\n)(?!\s*contact_email:)/,
  '$1    contact_email: cleanText(input.contact_email),\n'
);

write(certPath, cert);

let flow = read(flowPath);

flow = flow.replace(
  /(category:\s*"Workflow Agent",\r?\n)(?!\s*contactEmail:)/,
  '$1    contactEmail: "",\n'
);

const updateFunctionEnd = `  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {\n    setForm((current) => ({ ...current, [key]: value }));\n  }\n`;
const prefillEffect = `\n  useEffect(() => {\n    const email = (user as { email?: string } | null)?.email || "";\n    if (!email) return;\n\n    setForm((current) => {\n      if (current.contactEmail) return current;\n      return { ...current, contactEmail: email };\n    });\n  }, [user]);\n`;
flow = addAfterOnce(flow, updateFunctionEnd, prefillEffect);

flow = flow.replace(
  /(if \(!form\.agentName\.trim\(\) \|\| !form\.githubRepo\.trim\(\) \|\| !form\.readmeUrl\.trim\(\) \|\| !form\.evidenceSummary\.trim\(\)\) \{)/,
  `const contactEmail = form.contactEmail.trim();\n\n    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(contactEmail)) {\n      setMessage("Enter a valid contact email.");\n      return;\n    }\n\n    $1`
);

flow = flow.replace(
  /(agent_category:\s*form\.category,\r?\n)(?!\s*contact_email:)/,
  '$1        contact_email: form.contactEmail,\n'
);

const categoryFieldRegex = /(<Field label="Category">\s*\r?\n\s*<input value=\{form\.category\}[^\n]*\/>\s*\r?\n\s*<\/Field>)(?![\s\S]{0,500}<Field label="Contact email")/;
const contactEmailField = `$1\n            <Field label="Contact email" hint="Application notices will be sent to this email.">\n              <input type="email" value={form.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} className={inputClass} placeholder="member@example.com" autoComplete="email" />\n            </Field>`;
if (categoryFieldRegex.test(flow)) {
  flow = flow.replace(categoryFieldRegex, contactEmailField);
} else if (!flow.includes('label="Contact email"')) {
  throw new Error('Could not insert Contact email field. Category field pattern not found.');
}

flow = flow.replace(
  /(<Info label="Current stage" value=\{stageLabel\(application\.stage\)\} \/>\r?\n)(?!\s*<Info label="Contact email")/,
  '$1        <Info label="Contact email" value={application.contact_email || "Not set"} />\n'
);

write(flowPath, flow);

const readme = `AIAA V60 Application Contact Email\n\nWhat this patch changes:\n1. Adds Contact email to the certification application form.\n2. Prefills Contact email from the signed in account email when available.\n3. Saves contact_email into public.aiaa_certification_applications.\n4. Shows Contact email in the application tracker card.\n\nRun SQL file in Supabase SQL Editor before testing submission:\nsupabase/aiaa-certification-applications-v3.sql\n`;
fs.writeFileSync(path.join(root, 'AIAA_PATCH_V60_README.txt'), readme, 'utf8');

console.log('V60 contact email patch complete.');
console.log('Changed files:');
console.log('- components/certification-application-flow.tsx');
console.log('- lib/supabase/certification.ts');
console.log('- AIAA_PATCH_V60_README.txt');
console.log('Now run the V60 SQL file in Supabase, then npm run build.');
