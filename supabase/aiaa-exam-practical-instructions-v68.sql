-- AIAA V68
-- Clarify Level 1 Question 31 practical submission instructions.
-- This patch is safe to run more than once.

do $$
declare
  v_table text := 'aiaa_exam_questions';
  v_title text := 'L1 Basic Agent Workflow Build';
  v_prompt text := 'Build and submit evidence for a runnable Basic Agent Workflow. This is the practical task for Level 1. Do not upload files directly to AIAA at this stage. Submit public or reviewer accessible links.';
  v_instructions text := 'What to build:

Build a basic AI Agent workflow that can receive user input, analyze the task, call at least one external API or external tool, execute at least one tool call, record execution logs, retry on failure, return a clear error message when something fails, and return a final result.

What to submit:

Paste evidence links in the answer box using this exact format.

GitHub Repo:
https://github.com/account/project

README:
https://github.com/account/project#readme

Demo URL:
https://demo.example.com

Demo Video:
https://youtube.com/...

Screenshot:
https://github.com/account/project/blob/main/docs/assets/demo.png

Execution Log:
https://gist.github.com/account/...

Workflow Summary:
Explain what the agent does, how the workflow starts, what steps it runs, and what final output it returns.

Tool Calling Evidence:
Name the tool call and explain where it happens in the code or workflow.

External API Evidence:
Name the external API or service and explain what data it sends or receives.

Retry and Error Handling:
Explain what happens when a tool call or API request fails. Include retry count, failure message, and fallback behavior.

Required evidence:
1. User input handling.
2. Task analysis.
3. One external API or external tool.
4. One tool call.
5. Execution logs.
6. Retry logic.
7. Clear error message.
8. README.
9. Demo screenshot or demo video.

Passing criteria:
The reviewer must be able to verify that the workflow runs, the tool call is real, the external API or tool is real, the README explains setup, and the submission is not a prompt only project or UI only project.';
  v_rubric text := 'Reviewer checklist: runnable workflow, real tool call, real external API or tool, clear README, execution log, retry logic, error handling, demo screenshot or video. Reject prompt only projects, UI only projects, empty repositories, inaccessible links, and demos that cannot be reproduced.';
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = v_table
      and column_name = 'title'
  ) then
    execute 'update public.aiaa_exam_questions set title = $1 where level = 1 and position = 31'
    using v_title;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = v_table
      and column_name = 'question'
  ) then
    execute 'update public.aiaa_exam_questions set question = $1 where level = 1 and position = 31'
    using v_prompt;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = v_table
      and column_name = 'prompt'
  ) then
    execute 'update public.aiaa_exam_questions set prompt = $1 where level = 1 and position = 31'
    using v_prompt;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = v_table
      and column_name = 'description'
  ) then
    execute 'update public.aiaa_exam_questions set description = $1 where level = 1 and position = 31'
    using v_instructions;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = v_table
      and column_name = 'body'
  ) then
    execute 'update public.aiaa_exam_questions set body = $1 where level = 1 and position = 31'
    using v_instructions;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = v_table
      and column_name = 'rubric'
  ) then
    execute 'update public.aiaa_exam_questions set rubric = $1 where level = 1 and position = 31'
    using v_rubric;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = v_table
      and column_name = 'review_notes'
  ) then
    execute 'update public.aiaa_exam_questions set review_notes = $1 where level = 1 and position = 31'
    using v_rubric;
  end if;
end $$;

select
  level,
  position,
  title
from public.aiaa_exam_questions
where level = 1 and position = 31;
