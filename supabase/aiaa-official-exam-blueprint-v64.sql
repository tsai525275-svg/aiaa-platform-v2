-- AIAA Official Exam Blueprint V64

-- Replaces the temporary 6 question exam bank with the formal Level 1 to Level 5 certification exam system.

create extension if not exists pgcrypto;


create table if not exists public.aiaa_exam_level_policies (
  level integer primary key check (level between 1 and 5),
  official_name text not null,
  label text not null,
  exam_format text not null,
  multiple_choice_count integer not null default 0,
  practical_task_count integer not null default 0,
  architecture_review_count integer not null default 0,
  time_limit_minutes integer,
  passing_score integer,
  certificate_validity_months integer,
  passing_rate_cap_percent integer,
  nomination_only boolean not null default false,
  updated_at timestamptz not null default now()
);



alter table public.aiaa_exam_questions
  add column if not exists exam_section text not null default 'General',
  add column if not exists question_type text not null default 'Written',
  add column if not exists points integer not null default 1,
  add column if not exists expected_answer_format text not null default '',
  add column if not exists reviewer_notes text not null default '';



create or replace function public.aiaa_exam_policy_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_aiaa_exam_level_policies_updated_at on public.aiaa_exam_level_policies;
create trigger set_aiaa_exam_level_policies_updated_at
before update on public.aiaa_exam_level_policies
for each row execute function public.aiaa_exam_policy_updated_at();


insert into public.aiaa_exam_level_policies(level, official_name, label, exam_format, multiple_choice_count, practical_task_count, architecture_review_count, time_limit_minutes, passing_score, certificate_validity_months, passing_rate_cap_percent, nomination_only) values

  (1, 'AI Agent Operator', 'L1 Operator', 'Online multiple choice, practical task, document submission', 30, 1, 0, 90, 80, 12, null, false),
  (2, 'AI Agent Engineer', 'L2 Engineer', 'Online multiple choice, two practical tasks, deployment documents', 40, 2, 0, 180, 85, 12, null, false),
  (3, 'AI Agent Systems Architect', 'L3 Architect', 'Online multiple choice, three practical tasks, architecture review, benchmark report', 50, 3, 1, 1440, 90, 6, 15, false),
  (4, 'Certified AI Agent Company', 'L4 Company', 'Company questionnaire, document review, product demo, operations review', 20, 0, 1, null, 88, 3, null, false),
  (5, 'AIAA Association Fellow', 'L5 Fellow', 'Nomination, impact review, Council Review, Public Reputation Review', 0, 0, 0, null, null, 12, null, true)
on conflict (level) do update set
  official_name = excluded.official_name,
  label = excluded.label,
  exam_format = excluded.exam_format,
  multiple_choice_count = excluded.multiple_choice_count,
  practical_task_count = excluded.practical_task_count,
  architecture_review_count = excluded.architecture_review_count,
  time_limit_minutes = excluded.time_limit_minutes,
  passing_score = excluded.passing_score,
  certificate_validity_months = excluded.certificate_validity_months,
  passing_rate_cap_percent = excluded.passing_rate_cap_percent,
  nomination_only = excluded.nomination_only,
  updated_at = now();

update public.aiaa_exam_questions set is_active = false where level between 1 and 5;

insert into public.aiaa_exam_questions(level, position, exam_section, question_type, category, question, prompt, points, required, reviewer_notes, is_active) values

  (1, 1, 'Knowledge', 'Multiple Choice', 'L1 AI Fundamentals', 'Which prompt component should define the agent role, constraints, and operating rules?', 'A. User prompt
B. System prompt
C. Temperature
D. README', 1, true, 'Correct answer: B', true),
  (1, 2, 'Knowledge', 'Multiple Choice', 'L1 AI Fundamentals', 'What happens when a workflow exceeds the model context window?', 'A. The model stores all old context automatically
B. Older context may be truncated or lost
C. The API key resets
D. Tool calls stop working forever', 1, true, 'Correct answer: B', true),
  (1, 3, 'Knowledge', 'Multiple Choice', 'L1 AI Fundamentals', 'What is the most practical reason to estimate token usage in an agent workflow?', 'A. To design buttons
B. To control cost, latency, and context length
C. To choose a logo
D. To hide logs', 1, true, 'Correct answer: B', true),
  (1, 4, 'Knowledge', 'Multiple Choice', 'L1 AI Fundamentals', 'Which statement best describes LLM output behavior?', 'A. It is always deterministic
B. It can vary based on prompt, temperature, context, and model
C. It never uses context
D. It cannot call tools', 1, true, 'Correct answer: B', true),
  (1, 5, 'Knowledge', 'Multiple Choice', 'L1 AI Fundamentals', 'Why should an operator document the model used by an agent?', 'A. Models have identical behavior
B. Model behavior, cost, latency, and tool support can differ
C. Documentation is unrelated to reproducibility
D. It only affects website colors', 1, true, 'Correct answer: B', true),
  (1, 6, 'Knowledge', 'Multiple Choice', 'L1 AI Fundamentals', 'What does a lower temperature usually produce?', 'A. More random output
B. More consistent output
C. More API keys
D. More memory storage', 1, true, 'Correct answer: B', true),
  (1, 7, 'Knowledge', 'Multiple Choice', 'L1 AI Fundamentals', 'Why use few shot examples in an agent prompt?', 'A. To show expected input and output patterns
B. To replace all tests
C. To remove the need for logs
D. To hide tool schemas', 1, true, 'Correct answer: A', true),
  (1, 8, 'Knowledge', 'Multiple Choice', 'L1 AI Fundamentals', 'Which information should not be placed in a public system prompt?', 'A. Agent tone rules
B. Secret API keys
C. Output format rules
D. Safety constraints', 1, true, 'Correct answer: B', true),
  (1, 9, 'Knowledge', 'Multiple Choice', 'L1 Agent Workflow', 'What is the minimum sign of a real single agent workflow?', 'A. A static landing page
B. Input, task processing, tool execution, and output
C. A certificate image
D. A prompt screenshot only', 1, true, 'Correct answer: B', true),
  (1, 10, 'Knowledge', 'Multiple Choice', 'L1 Agent Workflow', 'What is prompt chaining?', 'A. Splitting a task into ordered LLM steps
B. Uploading images only
C. Replacing APIs with CSS
D. Saving passwords in logs', 1, true, 'Correct answer: A', true),
  (1, 11, 'Knowledge', 'Multiple Choice', 'L1 Agent Workflow', 'What does task routing decide?', 'A. Which tool, step, or handler should process the task
B. Which font to use
C. Which certificate color to show
D. Which browser tab is active', 1, true, 'Correct answer: A', true),
  (1, 12, 'Knowledge', 'Multiple Choice', 'L1 Agent Workflow', 'What proves that Tool Calling exists?', 'A. A user sees a button
B. The agent sends structured input to a tool and uses the returned result
C. The agent has a logo
D. The README has a title', 1, true, 'Correct answer: B', true),
  (1, 13, 'Knowledge', 'Multiple Choice', 'L1 Agent Workflow', 'Why define input and output schemas?', 'A. To make behavior easier to validate and debug
B. To remove all errors
C. To avoid using README
D. To skip authentication', 1, true, 'Correct answer: A', true),
  (1, 14, 'Knowledge', 'Multiple Choice', 'L1 Agent Workflow', 'Which evidence best proves workflow execution?', 'A. Screenshot of an empty form
B. Execution log showing steps, tool calls, result, and errors
C. A marketing slogan
D. A color palette', 1, true, 'Correct answer: B', true),
  (1, 15, 'Knowledge', 'Multiple Choice', 'L1 Agent Workflow', 'When should a retry run?', 'A. After every success
B. After recoverable failures such as temporary API or network errors
C. Before any input is received
D. Only when the UI is dark mode', 1, true, 'Correct answer: B', true),
  (1, 16, 'Knowledge', 'Multiple Choice', 'L1 Agent Workflow', 'What makes an automation reliable enough for Level 1?', 'A. It runs one clear workflow with logs and basic failure handling
B. It has no README
C. It hides all outputs
D. It requires manual copy paste for every step', 1, true, 'Correct answer: A', true),
  (1, 17, 'Knowledge', 'Multiple Choice', 'L1 Engineering Basics', 'What is an API request payload?', 'A. Data sent to an API endpoint
B. A color token
C. A browser bookmark
D. A certificate ID', 1, true, 'Correct answer: A', true),
  (1, 18, 'Knowledge', 'Multiple Choice', 'L1 Engineering Basics', 'Why is JSON common in tool calling?', 'A. It is structured and machine readable
B. It is only for images
C. It cannot represent objects
D. It prevents all bugs', 1, true, 'Correct answer: A', true),
  (1, 19, 'Knowledge', 'Multiple Choice', 'L1 Engineering Basics', 'What does a webhook usually do?', 'A. Sends event data from one system to another endpoint
B. Stores CSS variables
C. Deletes all logs
D. Replaces deployment', 1, true, 'Correct answer: A', true),
  (1, 20, 'Knowledge', 'Multiple Choice', 'L1 Engineering Basics', 'Where should API keys usually be stored?', 'A. In public GitHub README
B. In environment variables or secret storage
C. In browser screenshots
D. In the page title', 1, true, 'Correct answer: B', true),
  (1, 21, 'Knowledge', 'Multiple Choice', 'L1 Engineering Basics', 'Why should a README include command line setup steps?', 'A. So reviewers can reproduce the project
B. So the logo renders faster
C. So no tests are needed
D. So users cannot run it', 1, true, 'Correct answer: A', true),
  (1, 22, 'Knowledge', 'Multiple Choice', 'L1 Engineering Basics', 'What should a certification repository include?', 'A. Source code, README, setup steps, and relevant evidence
B. Only a blank repository
C. Only a screenshot
D. Only a sales page', 1, true, 'Correct answer: A', true),
  (1, 23, 'Knowledge', 'Multiple Choice', 'L1 Debug Basics', 'What is the first step when an API call fails?', 'A. Read the error message and response details
B. Delete the repository
C. Change the certificate color
D. Hide the failure from logs', 1, true, 'Correct answer: A', true),
  (1, 24, 'Knowledge', 'Multiple Choice', 'L1 Debug Basics', 'Which log entry helps reviewers most?', 'A. Timestamp, step name, tool input summary, result, and error if any
B. Random emojis
C. Hidden API keys
D. Browser zoom level', 1, true, 'Correct answer: A', true),
  (1, 25, 'Knowledge', 'Multiple Choice', 'L1 Debug Basics', 'What should retry logic avoid?', 'A. Infinite retries without limits
B. Clear retry limits
C. Logging failures
D. Recovering temporary errors', 1, true, 'Correct answer: A', true),
  (1, 26, 'Knowledge', 'Multiple Choice', 'L1 Debug Basics', 'What is basic failure recovery?', 'A. Returning a clear error and retrying recoverable failures
B. Pretending the task succeeded
C. Deleting the user input
D. Ignoring logs', 1, true, 'Correct answer: A', true),
  (1, 27, 'Knowledge', 'Multiple Choice', 'L1 Debug Basics', 'What evidence shows a failure was handled correctly?', 'A. Log of failed attempt, retry attempt, and final result or clear error
B. A blank screen
C. No output
D. A slogan', 1, true, 'Correct answer: A', true),
  (1, 28, 'Knowledge', 'Multiple Choice', 'L1 Tool Understanding', 'What is ChatGPT best used for in a Level 1 workflow process?', 'A. Reasoning, drafting, debugging help, and workflow design
B. Storing production secrets publicly
C. Replacing all logs
D. Certifying users automatically', 1, true, 'Correct answer: A', true),
  (1, 29, 'Knowledge', 'Multiple Choice', 'L1 Tool Understanding', 'What is OpenAI Codex mainly used for in agent engineering?', 'A. Code generation, code editing, and implementation assistance
B. Replacing every review requirement
C. Hiding source code
D. Issuing certificates', 1, true, 'Correct answer: A', true),
  (1, 30, 'Knowledge', 'Multiple Choice', 'L1 Tool Understanding', 'What is a correct role for Claude or Cursor in a project?', 'A. Code review, editing, architecture support, and implementation assistance
B. Guaranteeing production reliability without testing
C. Removing the need for a README
D. Storing user passwords in prompts', 1, true, 'Correct answer: A', true),
  (1, 31, 'Practical Task', 'L1 Basic Agent Workflow Build', 'Build and submit a Basic Agent Workflow.', 'Required evidence: user input handling, task analysis, one external API or tool, one tool call, execution logs, retry logic, clear error message, README, demo screenshot or demo video.', 20, true, 'Reviewer checks a runnable workflow, not a prompt-only or UI-only project.', '', true),
  (2, 1, 'Knowledge', 'Multiple Choice', 'L2 Agent Systems', 'What is the main risk in a long running workflow?', 'A. Lost state, timeout, partial failure, or unrecoverable progress
B. Too many colors
C. Too many screenshots
D. Too many badges', 1, true, 'Correct answer: A', true),
  (2, 2, 'Knowledge', 'Multiple Choice', 'L2 Agent Systems', 'What must be defined in a multi tool workflow?', 'A. Tool responsibility, input, output, and execution order
B. Only the button text
C. Only the logo
D. Only the certificate color', 1, true, 'Correct answer: A', true),
  (2, 3, 'Knowledge', 'Multiple Choice', 'L2 Agent Systems', 'Why use a task queue?', 'A. To manage asynchronous jobs, retries, and workload control
B. To hide source code
C. To replace a database forever
D. To remove monitoring', 1, true, 'Correct answer: A', true),
  (2, 4, 'Knowledge', 'Multiple Choice', 'L2 Agent Systems', 'What is async execution useful for?', 'A. Tasks that take time and should not block the user interface
B. Static text only
C. Logo generation only
D. Removing errors', 1, true, 'Correct answer: A', true),
  (2, 5, 'Knowledge', 'Multiple Choice', 'L2 Agent Systems', 'Where should Human In The Loop appear?', 'A. At approval, override, exception, or high risk decision points
B. In every CSS file
C. Only in the footer
D. Nowhere in production', 1, true, 'Correct answer: A', true),
  (2, 6, 'Knowledge', 'Multiple Choice', 'L2 Agent Systems', 'What does state management preserve?', 'A. Task progress, status, inputs, outputs, and recovery checkpoints
B. Browser zoom only
C. Random screenshots
D. Marketing headlines', 1, true, 'Correct answer: A', true),
  (2, 7, 'Knowledge', 'Multiple Choice', 'L2 Agent Systems', 'What is session management responsible for?', 'A. User identity, continuity, and secure access to workflow state
B. Choosing image size
C. Removing authentication
D. Replacing all logs', 1, true, 'Correct answer: A', true),
  (2, 8, 'Knowledge', 'Multiple Choice', 'L2 Agent Systems', 'Why split a workflow into stages?', 'A. To make retries, review, logging, and recovery easier
B. To make debugging impossible
C. To hide failed steps
D. To reduce documentation', 1, true, 'Correct answer: A', true),
  (2, 9, 'Knowledge', 'Multiple Choice', 'L2 Agent Systems', 'Why is idempotency important in retries?', 'A. It prevents duplicated side effects when the same task runs again
B. It changes fonts
C. It disables logs
D. It replaces API keys', 1, true, 'Correct answer: A', true),
  (2, 10, 'Knowledge', 'Multiple Choice', 'L2 Agent Systems', 'Which status set fits a production task?', 'A. queued, running, failed, completed, cancelled
B. pretty, blue, large, small
C. public, secret, hidden, magic
D. none', 1, true, 'Correct answer: A', true),
  (2, 11, 'Knowledge', 'Multiple Choice', 'L2 Reliability', 'What is a recovery checkpoint?', 'A. A saved point that lets the workflow resume after failure
B. A public password
C. A browser icon
D. A README title', 1, true, 'Correct answer: A', true),
  (2, 12, 'Knowledge', 'Multiple Choice', 'L2 Reliability', 'What is a fallback system?', 'A. A backup path when the primary model, tool, or API fails
B. A decorative image
C. A hidden bug
D. A payment link only', 1, true, 'Correct answer: A', true),
  (2, 13, 'Knowledge', 'Multiple Choice', 'L2 Reliability', 'What should a retry architecture include?', 'A. Limits, backoff, recoverable error types, and logging
B. Unlimited loops
C. No error classification
D. No timestamps', 1, true, 'Correct answer: A', true),
  (2, 14, 'Knowledge', 'Multiple Choice', 'L2 Reliability', 'What should production monitoring track?', 'A. success rate, failure rate, latency, cost, and error classes
B. only page title
C. only button clicks
D. only certificate color', 1, true, 'Correct answer: A', true),
  (2, 15, 'Knowledge', 'Multiple Choice', 'L2 Reliability', 'What is an execution trace?', 'A. A step by step record of a workflow run
B. A marketing page
C. A static prompt
D. A logo file', 1, true, 'Correct answer: A', true),
  (2, 16, 'Knowledge', 'Multiple Choice', 'L2 Reliability', 'What should never be written to logs?', 'A. Secret keys or sensitive raw personal data
B. Task ID
C. Error code
D. Timestamp', 1, true, 'Correct answer: A', true),
  (2, 17, 'Knowledge', 'Multiple Choice', 'L2 Reliability', 'When should a notification fire?', 'A. On completion, failure, human review, or high risk exception
B. Every millisecond
C. Only when nothing happens
D. Never', 1, true, 'Correct answer: A', true),
  (2, 18, 'Knowledge', 'Multiple Choice', 'L2 Reliability', 'What evidence proves reliability?', 'A. Logs, traces, retry records, and failure recovery examples
B. Only a landing page
C. Only a certificate image
D. Only a prompt', 1, true, 'Correct answer: A', true),
  (2, 19, 'Knowledge', 'Multiple Choice', 'L2 AI Engineering', 'What is prompt system design?', 'A. Structuring roles, rules, inputs, outputs, and constraints across the workflow
B. Choosing a random model name
C. Writing one vague sentence
D. Removing tool schemas', 1, true, 'Correct answer: A', true),
  (2, 20, 'Knowledge', 'Multiple Choice', 'L2 AI Engineering', 'What does context engineering control?', 'A. What information enters the model and when
B. The browser theme
C. The payment processor
D. The certificate ID', 1, true, 'Correct answer: A', true),
  (2, 21, 'Knowledge', 'Multiple Choice', 'L2 AI Engineering', 'What is memory injection?', 'A. Supplying stored relevant knowledge into the current model context
B. Storing secrets in public HTML
C. Removing all history
D. Uploading logos', 1, true, 'Correct answer: A', true),
  (2, 22, 'Knowledge', 'Multiple Choice', 'L2 AI Engineering', 'How should a system choose tools?', 'A. By task need, reliability, cost, latency, and permissions
B. Randomly
C. By logo color
D. By file name length', 1, true, 'Correct answer: A', true),
  (2, 23, 'Knowledge', 'Multiple Choice', 'L2 AI Engineering', 'Which method helps control cost?', 'A. Model routing, caching, token limits, batching, and stopping unnecessary calls
B. Infinite retries
C. Logging full secrets
D. Removing estimates', 1, true, 'Correct answer: A', true),
  (2, 24, 'Knowledge', 'Multiple Choice', 'L2 AI Engineering', 'Which technique can reduce latency?', 'A. Parallel independent steps and avoid unnecessary tool calls
B. Add unlimited model calls
C. Wait after every step
D. Remove monitoring', 1, true, 'Correct answer: A', true),
  (2, 25, 'Knowledge', 'Multiple Choice', 'L2 AI Engineering', 'Why evaluate outputs?', 'A. To measure accuracy, reliability, safety, and regression over time
B. To skip review
C. To hide defects
D. To remove tests', 1, true, 'Correct answer: A', true),
  (2, 26, 'Knowledge', 'Multiple Choice', 'L2 AI Engineering', 'What is model routing?', 'A. Choosing different models for different task types or budgets
B. Changing URLs randomly
C. Replacing all APIs
D. Removing state', 1, true, 'Correct answer: A', true),
  (2, 27, 'Knowledge', 'Multiple Choice', 'L2 Infrastructure', 'Why does a production workflow need a database?', 'A. To persist users, tasks, state, logs, and results
B. To store only colors
C. To remove authentication
D. To replace README', 1, true, 'Correct answer: A', true),
  (2, 28, 'Knowledge', 'Multiple Choice', 'L2 Infrastructure', 'What is Redis commonly used for?', 'A. Caching, queues, locks, and fast state access
B. Writing legal contracts
C. Rendering badges
D. Editing videos', 1, true, 'Correct answer: A', true),
  (2, 29, 'Knowledge', 'Multiple Choice', 'L2 Infrastructure', 'What does a queue protect against?', 'A. Overload and uncontrolled concurrent jobs
B. All security issues
C. All bad prompts
D. Missing README', 1, true, 'Correct answer: A', true),
  (2, 30, 'Knowledge', 'Multiple Choice', 'L2 Infrastructure', 'Why use Docker?', 'A. Reproducible runtime and deployment packaging
B. Certificate design
C. Prompt writing only
D. User ranking only', 1, true, 'Correct answer: A', true),
  (2, 31, 'Knowledge', 'Multiple Choice', 'L2 Infrastructure', 'What must deployment documentation include?', 'A. Environment variables, build command, run command, services, and troubleshooting
B. Only logo size
C. Only social links
D. Only homepage text', 1, true, 'Correct answer: A', true),
  (2, 32, 'Knowledge', 'Multiple Choice', 'L2 Infrastructure', 'Where should production secrets be stored?', 'A. Managed secret storage or environment variables
B. Public repository
C. Browser console screenshot
D. README examples with real keys', 1, true, 'Correct answer: A', true),
  (2, 33, 'Knowledge', 'Multiple Choice', 'L2 Infrastructure', 'Why plan rollback?', 'A. To restore service after a bad release
B. To remove monitoring
C. To skip tests
D. To delete users', 1, true, 'Correct answer: A', true),
  (2, 34, 'Knowledge', 'Multiple Choice', 'L2 Infrastructure', 'What does a health check verify?', 'A. Service availability and dependency readiness
B. Certificate color
C. Profile photo size
D. Marketing copy', 1, true, 'Correct answer: A', true),
  (2, 35, 'Knowledge', 'Multiple Choice', 'L2 Tool Understanding', 'What is Codex best used for in Level 2 work?', 'A. Code implementation, refactoring, and debugging with human review
B. Automatic certification without evidence
C. Replacing all architecture decisions
D. Hiding errors', 1, true, 'Correct answer: A', true),
  (2, 36, 'Knowledge', 'Multiple Choice', 'L2 Tool Understanding', 'What is Claude Code useful for?', 'A. Code reasoning, edits, refactors, and project level assistance
B. Issuing company certificates
C. Replacing monitoring
D. Storing secrets publicly', 1, true, 'Correct answer: A', true),
  (2, 37, 'Knowledge', 'Multiple Choice', 'L2 Tool Understanding', 'What role can OpenHands play?', 'A. Autonomous coding workflow assistance with repository level tasks
B. Replacing production review
C. Hiding failed builds
D. Removing tests', 1, true, 'Correct answer: A', true),
  (2, 38, 'Knowledge', 'Multiple Choice', 'L2 Tool Understanding', 'What does a Hermes style workflow emphasize?', 'A. Tool based agent automation, workflows, and operational execution
B. Static slides only
C. No logs
D. No external integrations', 1, true, 'Correct answer: A', true),
  (2, 39, 'Knowledge', 'Multiple Choice', 'L2 Tool Understanding', 'Why document tool permissions?', 'A. Reviewers need to know what each tool can access and change
B. It is unrelated to security
C. It replaces deployment
D. It makes logs unnecessary', 1, true, 'Correct answer: A', true),
  (2, 40, 'Knowledge', 'Multiple Choice', 'L2 Tool Understanding', 'Why must applicants explain architecture themselves?', 'A. Codex can assist coding, but certification checks engineering judgment
B. Because documentation is optional
C. Because models never make errors
D. Because reviewers do not need evidence', 1, true, 'Correct answer: A', true),
  (2, 41, 'Practical Task', 'L2 Production Workflow System', 'Build and submit a Production Workflow System.', 'Required evidence: at least three tools, task status, queue or scheduler, retry, logging, state persistence, human override, Telegram or Discord notification, cost estimate, deployment guide.', 25, true, 'Reviewer checks production workflow quality.', '', true),
  (2, 42, 'Practical Task', 'L2 Failure Recovery Test', 'Demonstrate failure recovery.', 'Required evidence: simulated API failure, interrupted task, error log, retry behavior, human stop or restart control, final recovery record.', 25, true, 'Reviewer checks recovery under controlled failure.', '', true),
  (3, 1, 'Knowledge', 'Multiple Choice', 'L3 Multi Agent', 'What is agent orchestration?', 'A. Coordinating multiple agent roles and task handoffs
B. Rendering a static page
C. Storing a password in a prompt
D. Removing logs', 1, true, 'Correct answer: A', true),
  (3, 2, 'Knowledge', 'Multiple Choice', 'L3 Multi Agent', 'Why define roles for agents?', 'A. To reduce ambiguity and assign clear responsibilities
B. To make every agent do everything
C. To hide failures
D. To skip testing', 1, true, 'Correct answer: A', true),
  (3, 3, 'Knowledge', 'Multiple Choice', 'L3 Multi Agent', 'What does a supervisor agent do?', 'A. Coordinates workers, validates progress, and controls routing
B. Stores only CSS
C. Replaces all databases
D. Removes human review', 1, true, 'Correct answer: A', true),
  (3, 4, 'Knowledge', 'Multiple Choice', 'L3 Multi Agent', 'What does a planner agent produce?', 'A. A task plan, subgoals, dependencies, and execution order
B. A logo file
C. A payment receipt only
D. A static certificate', 1, true, 'Correct answer: A', true),
  (3, 5, 'Knowledge', 'Multiple Choice', 'L3 Multi Agent', 'What should a worker agent own?', 'A. A specific task or tool responsibility
B. Every unrelated business decision
C. All secrets
D. No logs', 1, true, 'Correct answer: A', true),
  (3, 6, 'Knowledge', 'Multiple Choice', 'L3 Multi Agent', 'What is a core challenge of distributed agents?', 'A. Coordination, state consistency, failure handling, and observability
B. Choosing text size
C. Hiding routes
D. Removing queues', 1, true, 'Correct answer: A', true),
  (3, 7, 'Knowledge', 'Multiple Choice', 'L3 Multi Agent', 'What does tool routing determine?', 'A. Which agent or tool handles the next action
B. Which color the badge has
C. Which page scrolls
D. Which file icon appears', 1, true, 'Correct answer: A', true),
  (3, 8, 'Knowledge', 'Multiple Choice', 'L3 Multi Agent', 'How should agents resolve conflicting outputs?', 'A. Use validation, supervisor review, scoring, or human escalation
B. Pick the longest output automatically
C. Ignore the conflict
D. Delete all traces', 1, true, 'Correct answer: A', true),
  (3, 9, 'Knowledge', 'Multiple Choice', 'L3 Multi Agent', 'Why decompose tasks?', 'A. To assign subtasks to the correct roles and monitor progress
B. To make all tasks vague
C. To remove tool calls
D. To hide cost', 1, true, 'Correct answer: A', true),
  (3, 10, 'Knowledge', 'Multiple Choice', 'L3 Multi Agent', 'What indicates poor multi agent design?', 'A. Agents duplicate work, overwrite state, and lack ownership
B. Clear roles and logs
C. Structured routing
D. Supervisor validation', 1, true, 'Correct answer: A', true),
  (3, 11, 'Knowledge', 'Multiple Choice', 'L3 Memory Systems', 'What is a vector database used for?', 'A. Similarity search over embedded content
B. Storing only images
C. Removing retrieval
D. Replacing access control', 1, true, 'Correct answer: A', true),
  (3, 12, 'Knowledge', 'Multiple Choice', 'L3 Memory Systems', 'What should retrieval return?', 'A. Relevant, scoped, and traceable context
B. Random unrelated text
C. All database rows always
D. Secret keys', 1, true, 'Correct answer: A', true),
  (3, 13, 'Knowledge', 'Multiple Choice', 'L3 Memory Systems', 'What is long term memory for?', 'A. Persisting useful facts across sessions or tasks
B. Keeping only current page state
C. Replacing all logs
D. Storing public passwords', 1, true, 'Correct answer: A', true),
  (3, 14, 'Knowledge', 'Multiple Choice', 'L3 Memory Systems', 'Why persist context?', 'A. To resume or audit multi step tasks
B. To skip state management
C. To remove all cost reports
D. To avoid testing', 1, true, 'Correct answer: A', true),
  (3, 15, 'Knowledge', 'Multiple Choice', 'L3 Memory Systems', 'What is shared memory risk?', 'A. Incorrect access, stale data, leakage, or conflicting writes
B. More readable README
C. Better documentation
D. Less audit need', 1, true, 'Correct answer: A', true),
  (3, 16, 'Knowledge', 'Multiple Choice', 'L3 Memory Systems', 'What should memory governance include?', 'A. Write rules, read permissions, retention, and deletion policy
B. Unlimited storage of everything
C. No audit
D. No data isolation', 1, true, 'Correct answer: A', true),
  (3, 17, 'Knowledge', 'Multiple Choice', 'L3 Memory Systems', 'What metric helps evaluate retrieval quality?', 'A. relevance and grounding of returned context
B. button size
C. domain age only
D. UI color', 1, true, 'Correct answer: A', true),
  (3, 18, 'Knowledge', 'Multiple Choice', 'L3 Memory Systems', 'What is a memory failure mode?', 'A. Retrieval returns stale, irrelevant, or unauthorized information
B. README is too clear
C. Logs are structured
D. Workflow has checkpoints', 1, true, 'Correct answer: A', true),
  (3, 19, 'Knowledge', 'Multiple Choice', 'L3 Infrastructure', 'Why split services in large systems?', 'A. Independent scaling, isolation, deployment, and ownership
B. To remove observability
C. To force every task into one file
D. To avoid interfaces', 1, true, 'Correct answer: A', true),
  (3, 20, 'Knowledge', 'Multiple Choice', 'L3 Infrastructure', 'What does a distributed queue support?', 'A. Scalable, durable, asynchronous task processing
B. Static page rendering only
C. No retries
D. Manual copy paste', 1, true, 'Correct answer: A', true),
  (3, 21, 'Knowledge', 'Multiple Choice', 'L3 Infrastructure', 'What should be scaled first?', 'A. The bottleneck proven by metrics
B. The logo
C. The certificate image
D. The homepage headline', 1, true, 'Correct answer: A', true),
  (3, 22, 'Knowledge', 'Multiple Choice', 'L3 Infrastructure', 'What belongs in monitoring?', 'A. logs, metrics, traces, alerts, dashboards
B. only images
C. only button labels
D. hidden failures', 1, true, 'Correct answer: A', true),
  (3, 23, 'Knowledge', 'Multiple Choice', 'L3 Infrastructure', 'What does CI CD protect?', 'A. Build, test, deployment, and release quality
B. Public secrets
C. Random deployments
D. Manual only releases', 1, true, 'Correct answer: A', true),
  (3, 24, 'Knowledge', 'Multiple Choice', 'L3 Infrastructure', 'What proves production deployment?', 'A. Live environment, deployment logs, config, monitoring, and runbook
B. Local screenshots only
C. A PPT
D. A prompt', 1, true, 'Correct answer: A', true),
  (3, 25, 'Knowledge', 'Multiple Choice', 'L3 Infrastructure', 'Why is observability required?', 'A. To understand system behavior during success and failure
B. To hide errors
C. To avoid logs
D. To prevent testing', 1, true, 'Correct answer: A', true),
  (3, 26, 'Knowledge', 'Multiple Choice', 'L3 Infrastructure', 'What should an incident response plan include?', 'A. detection, ownership, mitigation, communication, and postmortem
B. only marketing copy
C. no roles
D. no records', 1, true, 'Correct answer: A', true),
  (3, 27, 'Knowledge', 'Multiple Choice', 'L3 Infrastructure', 'What should API documentation include?', 'A. endpoints, auth, schemas, examples, errors, and limits
B. only brand story
C. no error codes
D. no request examples', 1, true, 'Correct answer: A', true),
  (3, 28, 'Knowledge', 'Multiple Choice', 'L3 Infrastructure', 'What is an SLO?', 'A. A measurable service objective such as uptime or latency target
B. A logo style option
C. A prompt type
D. A private password', 1, true, 'Correct answer: A', true),
  (3, 29, 'Knowledge', 'Multiple Choice', 'L3 Security', 'What does a permission system control?', 'A. Who can access, run, update, or view resources
B. Font size
C. Badge color
D. Ranking title', 1, true, 'Correct answer: A', true),
  (3, 30, 'Knowledge', 'Multiple Choice', 'L3 Security', 'Why sandbox tool execution?', 'A. To limit damage from unsafe or unexpected behavior
B. To publish secrets
C. To remove security review
D. To skip tests', 1, true, 'Correct answer: A', true),
  (3, 31, 'Knowledge', 'Multiple Choice', 'L3 Security', 'What is correct secrets management?', 'A. Store secrets outside source code and rotate them when needed
B. Commit secrets to GitHub
C. Log all secrets
D. Put keys in prompts', 1, true, 'Correct answer: A', true),
  (3, 32, 'Knowledge', 'Multiple Choice', 'L3 Security', 'What should audit logs record?', 'A. important access, changes, approvals, and security relevant actions
B. raw passwords
C. private tokens
D. nothing', 1, true, 'Correct answer: A', true),
  (3, 33, 'Knowledge', 'Multiple Choice', 'L3 Security', 'Why isolate customer data?', 'A. To prevent cross user or cross tenant leakage
B. To make retrieval random
C. To remove access control
D. To skip encryption decisions', 1, true, 'Correct answer: A', true),
  (3, 34, 'Knowledge', 'Multiple Choice', 'L3 Security', 'What is least privilege?', 'A. Give each tool and user only required permissions
B. Give everyone admin access
C. Disable logs
D. Share all secrets', 1, true, 'Correct answer: A', true),
  (3, 35, 'Knowledge', 'Multiple Choice', 'L3 Security', 'What is a prompt injection risk?', 'A. External content may try to override system or tool rules
B. It improves security automatically
C. It only affects colors
D. It cannot happen in agents', 1, true, 'Correct answer: A', true),
  (3, 36, 'Knowledge', 'Multiple Choice', 'L3 Security', 'What evidence belongs in a security review?', 'A. permissions, secrets handling, data isolation, audit logs, and threat model
B. only screenshots
C. only slogans
D. no diagrams', 1, true, 'Correct answer: A', true),
  (3, 37, 'Knowledge', 'Multiple Choice', 'L3 Benchmark', 'What should performance evaluation measure?', 'A. success rate, latency, cost, failure rate, and quality
B. only homepage traffic
C. only certificate color
D. no metrics', 1, true, 'Correct answer: A', true),
  (3, 38, 'Knowledge', 'Multiple Choice', 'L3 Benchmark', 'What is p95 latency?', 'A. Time under which 95 percent of requests complete
B. Average logo size
C. A retry count only
D. A prompt token type', 1, true, 'Correct answer: A', true),
  (3, 39, 'Knowledge', 'Multiple Choice', 'L3 Benchmark', 'What should cost analysis include?', 'A. model cost, tool cost, retries, storage, and usage assumptions
B. only sales copy
C. no token estimate
D. no usage data', 1, true, 'Correct answer: A', true),
  (3, 40, 'Knowledge', 'Multiple Choice', 'L3 Benchmark', 'What contributes to reliability score?', 'A. successful runs, recoveries, incident rate, and consistency
B. number of colors
C. number of slogans
D. length of title', 1, true, 'Correct answer: A', true),
  (3, 41, 'Knowledge', 'Multiple Choice', 'L3 Benchmark', 'What should a benchmark report include?', 'A. dataset or task set, methodology, metrics, results, and limitations
B. only a screenshot
C. only a badge
D. no reproducibility detail', 1, true, 'Correct answer: A', true),
  (3, 42, 'Knowledge', 'Multiple Choice', 'L3 Benchmark', 'Why run regression tests?', 'A. To detect quality drops after changes
B. To remove monitoring
C. To avoid benchmarks
D. To hide failures', 1, true, 'Correct answer: A', true),
  (3, 43, 'Knowledge', 'Multiple Choice', 'L3 Benchmark', 'What does failure analysis explain?', 'A. why runs failed, how often, and what was changed
B. only success stories
C. no evidence
D. no data', 1, true, 'Correct answer: A', true),
  (3, 44, 'Knowledge', 'Multiple Choice', 'L3 Benchmark', 'What makes a benchmark production relevant?', 'A. It reflects real workloads, constraints, and operating limits
B. It tests only font size
C. It runs one fake prompt only
D. It ignores cost', 1, true, 'Correct answer: A', true),
  (3, 45, 'Knowledge', 'Multiple Choice', 'L3 Tools and Frameworks', 'What is MCP useful for?', 'A. Standardizing model access to tools and context resources
B. Storing public passwords
C. Rendering logos
D. Removing APIs', 1, true, 'Correct answer: A', true),
  (3, 46, 'Knowledge', 'Multiple Choice', 'L3 Tools and Frameworks', 'Why use a graph based agent framework?', 'A. To model stateful workflows, branches, loops, and agent coordination
B. To remove state
C. To hide architecture
D. To avoid deployment', 1, true, 'Correct answer: A', true),
  (3, 47, 'Knowledge', 'Multiple Choice', 'L3 Tools and Frameworks', 'What would Hermes style evidence show?', 'A. Operational workflows, tool execution, automation, and logs
B. Static landing page only
C. No tool calls
D. No run history', 1, true, 'Correct answer: A', true),
  (3, 48, 'Knowledge', 'Multiple Choice', 'L3 Tools and Frameworks', 'What should framework evaluation consider?', 'A. orchestration, extensibility, reliability, and production fit
B. logo only
C. no docs
D. no benchmark', 1, true, 'Correct answer: A', true),
  (3, 49, 'Knowledge', 'Multiple Choice', 'L3 Tools and Frameworks', 'What must remain human owned when AI coding tools help?', 'A. architecture judgment, security decisions, evidence, and accountability
B. nothing
C. all secrets in prompts
D. all reviews skipped', 1, true, 'Correct answer: A', true),
  (3, 50, 'Knowledge', 'Multiple Choice', 'L3 Tools and Frameworks', 'What is framework lock in risk?', 'A. Hard to migrate, test, or operate outside one stack
B. Better logs automatically
C. More security automatically
D. No deployment risk', 1, true, 'Correct answer: A', true),
  (3, 51, 'Practical Task', 'L3 Production Multi Agent System', 'Build and submit a Production Multi Agent System.', 'Required evidence: at least three agents, clear roles, supervisor or planner, shared memory, state recovery, tool routing, and API documentation.', 30, true, 'Reviewer checks multi agent system architecture.', '', true),
  (3, 52, 'Practical Task', 'L3 Monitoring and Cost Tracking', 'Submit monitoring and cost tracking evidence.', 'Required evidence: monitoring dashboard, cost tracking, error rate, latency tracking, success rate records, and execution trace query.', 20, true, 'Reviewer checks operational visibility.', '', true),
  (3, 53, 'Practical Task', 'L3 Security and Recovery Layer', 'Submit security and recovery evidence.', 'Required evidence: permission control, secrets management, audit logs, data isolation, failure recovery, and benchmark report.', 20, true, 'Reviewer checks security and resilience.', '', true),
  (3, 54, 'Architecture Review', 'L3 Architecture Review', 'Submit the full architecture review package.', 'Required documents: system architecture diagram, agent role diagram, data flow diagram, memory design, security design, cost design, deployment architecture, benchmark results, and API documentation.', 30, true, 'Council or senior reviewer reviews architecture package.', '', true),
  (4, 1, 'Company Questionnaire', 'L4 Company Basics', 'Company legal name, website, and operating identity', 'Provide a precise answer with supporting evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 2, 'Company Questionnaire', 'L4 Company Basics', 'Team structure and accountable owner', 'Provide a precise answer with supporting evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 3, 'Company Questionnaire', 'L4 Company Basics', 'Product positioning and target customer', 'Provide a precise answer with supporting evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 4, 'Company Questionnaire', 'L4 Product Capability', 'Real AI Agent product description', 'Explain the current production state and evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 5, 'Company Questionnaire', 'L4 Product Capability', 'Agent functions and customer workflow', 'Explain the current production state and evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 6, 'Company Questionnaire', 'L4 Product Capability', 'Product stability and production usage', 'Explain the current production state and evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 7, 'Company Questionnaire', 'L4 Product Capability', 'Active users or customer usage evidence', 'Explain the current production state and evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 8, 'Company Questionnaire', 'L4 Production Infrastructure', 'Production infrastructure overview', 'Provide operational details and evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 9, 'Company Questionnaire', 'L4 Production Infrastructure', 'SLA and uptime target', 'Provide operational details and evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 10, 'Company Questionnaire', 'L4 Production Infrastructure', 'Incident response process', 'Provide operational details and evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 11, 'Company Questionnaire', 'L4 Production Infrastructure', 'Monitoring and scaling model', 'Provide operational details and evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 12, 'Company Questionnaire', 'L4 Security Review', 'Data protection and retention policy', 'Provide documents or reviewer access evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 13, 'Company Questionnaire', 'L4 Security Review', 'API governance and access control', 'Provide documents or reviewer access evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 14, 'Company Questionnaire', 'L4 Security Review', 'Security documentation and risk handling', 'Provide documents or reviewer access evidence.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 15, 'Company Questionnaire', 'L4 Customer Support', 'Customer support workflow', 'Explain support operations and proof.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 16, 'Company Questionnaire', 'L4 Customer Support', 'Customer issue tracking and escalation', 'Explain support operations and proof.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 17, 'Company Questionnaire', 'L4 Revenue Systems', 'Revenue model and payment flow', 'Submit proof or redacted documentation.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 18, 'Company Questionnaire', 'L4 Revenue Systems', 'Contracts, subscriptions, or revenue tier evidence', 'Submit proof or redacted documentation.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 19, 'Company Questionnaire', 'L4 Benchmark', 'Benchmark system and performance metrics', 'Provide reports, screenshots, or dashboard links.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 20, 'Company Questionnaire', 'L4 Benchmark', 'Uptime report and production reliability evidence', 'Provide reports, screenshots, or dashboard links.', 5, true, 'Reviewer scores company evidence.', '', true),
  (4, 21, 'Document Review', 'L4 Required Document', 'Official website', 'Upload or link the required document. Redact sensitive customer or financial information where needed.', 10, true, 'Required document for company certification.', '', true),
  (4, 22, 'Document Review', 'L4 Required Document', 'Product demo', 'Upload or link the required document. Redact sensitive customer or financial information where needed.', 10, true, 'Required document for company certification.', '', true),
  (4, 23, 'Document Review', 'L4 Required Document', 'Company documents', 'Upload or link the required document. Redact sensitive customer or financial information where needed.', 10, true, 'Required document for company certification.', '', true),
  (4, 24, 'Document Review', 'L4 Required Document', 'API documentation', 'Upload or link the required document. Redact sensitive customer or financial information where needed.', 10, true, 'Required document for company certification.', '', true),
  (4, 25, 'Document Review', 'L4 Required Document', 'Customer case studies', 'Upload or link the required document. Redact sensitive customer or financial information where needed.', 10, true, 'Required document for company certification.', '', true),
  (4, 26, 'Document Review', 'L4 Required Document', 'Revenue proof', 'Upload or link the required document. Redact sensitive customer or financial information where needed.', 10, true, 'Required document for company certification.', '', true),
  (4, 27, 'Document Review', 'L4 Required Document', 'Benchmark report', 'Upload or link the required document. Redact sensitive customer or financial information where needed.', 10, true, 'Required document for company certification.', '', true),
  (4, 28, 'Document Review', 'L4 Required Document', 'Security or uptime report', 'Upload or link the required document. Redact sensitive customer or financial information where needed.', 10, true, 'Required document for company certification.', '', true),
  (4, 29, 'Demo Review', 'L4 Demo Review', 'Complete one company product demo review.', 'Reviewers check if the product runs in production, customer workflow is complete, monitoring exists, failure handling works, support workflow exists, and business delivery is credible.', 20, true, 'Manual company demo review.', '', true),
  (5, 1, 'Impact Review', 'L5 Fellow Review', 'Global impact', 'Provide evidence of international influence, adoption, references, or ecosystem reach.', 10, true, 'Council and Fellow Review item.', '', true),
  (5, 2, 'Impact Review', 'L5 Fellow Review', 'Open source impact', 'Provide repository, maintainer, adoption, contributor, or downstream usage evidence.', 10, true, 'Council and Fellow Review item.', '', true),
  (5, 3, 'Impact Review', 'L5 Fellow Review', 'Technical originality', 'Explain the original technical contribution, framework, protocol, research, or infrastructure.', 10, true, 'Council and Fellow Review item.', '', true),
  (5, 4, 'Impact Review', 'L5 Fellow Review', 'Public trust', 'Provide evidence of transparent work, reputation, ethics, and public accountability.', 10, true, 'Council and Fellow Review item.', '', true),
  (5, 5, 'Impact Review', 'L5 Fellow Review', 'Ecosystem contribution', 'List concrete contributions to the AI Agent ecosystem.', 10, true, 'Council and Fellow Review item.', '', true),
  (5, 6, 'Impact Review', 'L5 Fellow Review', 'Standards design ability', 'Explain standards, protocols, governance, review methods, or evaluation systems the applicant can help define.', 10, true, 'Council and Fellow Review item.', '', true),
  (5, 7, 'Impact Review', 'L5 Fellow Review', 'AI governance understanding', 'Explain governance thinking, safety tradeoffs, accountability, and public infrastructure thinking.', 10, true, 'Council and Fellow Review item.', '', true),
  (5, 8, 'Impact Review', 'L5 Fellow Review', 'Industry leadership', 'Provide evidence of leadership across companies, communities, conferences, or publications.', 10, true, 'Council and Fellow Review item.', '', true),
  (5, 9, 'Impact Review', 'L5 Fellow Review', 'Cross organization coordination', 'Provide evidence of working across teams, communities, open source groups, or companies.', 10, true, 'Council and Fellow Review item.', '', true),
  (5, 10, 'Impact Review', 'L5 Fellow Review', 'Long term contribution record', 'Provide a timeline of durable contributions and third party validation.', 10, true, 'Council and Fellow Review item.', '', true)
on conflict (level, position) do update set
  exam_section = excluded.exam_section,
  question_type = excluded.question_type,
  category = excluded.category,
  question = excluded.question,
  prompt = excluded.prompt,
  points = excluded.points,
  required = excluded.required,
  reviewer_notes = excluded.reviewer_notes,
  is_active = true,
  updated_at = now();


select level, count(*) as active_question_count
from public.aiaa_exam_questions
where is_active = true and level between 1 and 5
group by level
order by level;
