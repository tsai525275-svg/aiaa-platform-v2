update public.aiaa_exam_questions
set
  category = 'L1 Practical Evidence Submission',
  question_type = 'Practical Task',
  question = 'Basic Agent Workflow Build',
  prompt = 'Submit evidence that proves your agent workflow can run. Required evidence: GitHub repository URL, README URL, demo video or screenshot or demo URL, execution log URL, workflow summary, tool calling evidence, external API or tool evidence, retry logic, and error handling. Reviewers must be able to verify a runnable workflow, not a prompt-only or UI-only project.',
  expected_answer_format = 'Structured evidence fields: githubRepoUrl, readmeUrl, demoUrl, demoVideoUrl, screenshotUrl, executionLogUrl, workflowSummary, toolCallingEvidence, externalApiEvidence, retryAndErrorHandling.',
  reviewer_notes = 'Pass only if the submission proves user input handling, task analysis, one external API or tool, one tool call, execution logs, retry logic, clear error handling, README, and demo evidence. Reject prompt-only, UI-only, non-runnable, or unclear submissions.',
  points = 20,
  required = true,
  is_active = true,
  updated_at = now()
where level = 1 and position = 31;

select level, position, category, question_type, question, points, required
from public.aiaa_exam_questions
where level = 1 and position = 31;
