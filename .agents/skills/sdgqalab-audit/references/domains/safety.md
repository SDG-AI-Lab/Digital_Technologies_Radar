---
domain_id: safety
domain_name: Safety
check_prefix: SAF

iso:
  quality_characteristic: Safety
  sub_characteristics:
    - operational_constraint
    - risk_identification
    - fail_safe
    - hazard_warning
    - safe_integration
  grounding_standards:
    - id: "ISO/IEC 42001:2023"
      focus: "AI management system — governance, risk management, responsible AI"
    - id: "ISO/IEC 23894:2023"
      focus: "AI risk management — identification, analysis, evaluation, treatment"
    - id: "ISO/IEC 25059"
      focus: "AI quality — transparency, robustness, controllability"
    - id: "ISO/IEC 42005"
      focus: "AI system impact assessment"

applicability:
  always_include: false
  triggers:
    - langchain
    - openai
    - anthropic
    - huggingface
    - tensorflow
    - pytorch
    - chromadb
    - pinecone
    - weaviate
    - any_ai_ml
  description: "Active for layers with AI/ML components"

scope: per-layer
---

# Safety

> AI/ML system safety — guardrails, risk controls, fail-safes, and
> accountability mechanisms that prevent AI components from causing harm.

This domain is **only activated** when a layer contains AI/ML components
(model inference, LLM API calls, embedding pipelines, agent frameworks).
It covers the entire lifecycle: input filtering → model interaction →
output validation → human oversight → audit trail.

**ISO grounding:** ISO/IEC 42001 (AI governance), ISO/IEC 23894 (AI risk
management), ISO/IEC 25059 (AI quality extensions), ISO/IEC 42005 (AI
impact assessment). These inform our check structure; the audit output
speaks developer language, not compliance jargon.

---

## Operational Constraints

Checks that enforce hard boundaries on what the AI system can do —
cost limits, rate limits, content filtering. These are the guardrails
that prevent the system from running off the rails.

---

### SAF-001: Output Content Filtering

| Field | Value |
|---|---|
| **What to Look For** | Guardrails that filter harmful, toxic, biased, or inappropriate content from AI-generated outputs before they reach the user. |
| **How to Check** | 1. Search for output filtering middleware or post-processing: `grep -r "content_filter\|moderation\|guardrail\|toxicity\|harmful\|safety_check\|output_filter\|response_filter\|content_policy" --include="*.py" --include="*.ts" --include="*.js"`. 2. Check for OpenAI moderation API usage: `grep -r "moderations\|content_policy_violation\|openai.Moderation" --include="*.py" --include="*.ts"`. 3. Look for custom blocklist/denylist patterns: `grep -r "blocklist\|denylist\|banned_words\|prohibited\|unsafe_content" --include="*.py" --include="*.ts" --include="*.json" --include="*.yaml"`. 4. Check for NeMo Guardrails, Guardrails AI, or LangChain output parsers: `grep -r "nemoguardrails\|guardrails_ai\|OutputParser\|output_guard\|LLMGuard" --include="*.py" --include="*.ts"`. 5. Inspect the response pipeline — trace from model response to user-facing output and confirm a filtering step exists. |
| **Pass** | Output filtering is implemented as a mandatory step in the response pipeline. Harmful content is caught and either sanitized or replaced with a safe fallback. Evidence of filter configuration (categories, thresholds) exists. |
| **Partial** | Some filtering exists but is incomplete — e.g., only checks toxicity but not PII leakage in outputs, or filtering is present but can be bypassed via certain code paths. |
| **Fail** | No output content filtering. Model responses are returned directly to users without any safety check. |
| **Severity** | critical |
| **Tech Triggers** | [any_ai_ml] |

---

### SAF-002: Input Content Filtering

| Field | Value |
|---|---|
| **What to Look For** | Input moderation that screens user prompts before they reach the model — prevents prompt injection, jailbreak attempts, and harmful input. |
| **How to Check** | 1. Search for input validation/moderation: `grep -r "input_filter\|prompt_filter\|moderation\|input_validation\|sanitize_prompt\|prompt_guard\|injection_detect\|jailbreak" --include="*.py" --include="*.ts" --include="*.js"`. 2. Check for prompt injection defenses: `grep -r "prompt_injection\|system_prompt.*protect\|instruction_hierarchy\|delimiter\|input_guard" --include="*.py" --include="*.ts"`. 3. Look for input length limits on prompt fields: `grep -r "max_length\|maxlength\|max_chars\|prompt.*limit\|input.*limit" --include="*.py" --include="*.ts" --include="*.js"`. 4. Verify moderation runs BEFORE the LLM call, not after — trace the request handling pipeline. 5. Check for OpenAI moderation endpoint or equivalent pre-screening: `grep -r "moderations\.create\|content_moderation\|pre_screen" --include="*.py" --include="*.ts"`. |
| **Pass** | Input moderation is applied to all user-submitted prompts before they reach the model. Prompt injection defenses are in place. Input length is bounded. |
| **Partial** | Some input filtering exists but gaps remain — e.g., moderation on one endpoint but not others, or length limits without content screening. |
| **Fail** | User input is passed directly to the model without any moderation, validation, or sanitization. |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

---

### SAF-003: Token/Cost Limits

| Field | Value |
|---|---|
| **What to Look For** | Per-request and per-user token limits that prevent runaway API costs. Hard caps on `max_tokens`, budget ceilings, and cost alerting. |
| **How to Check** | 1. Search for max_tokens configuration: `grep -r "max_tokens\|maxTokens\|max_output_tokens\|maximum_tokens\|token_limit" --include="*.py" --include="*.ts" --include="*.js" --include="*.yaml" --include="*.env"`. 2. Check for per-user or per-session budget limits: `grep -r "budget\|cost_limit\|spending_limit\|usage_limit\|quota" --include="*.py" --include="*.ts" --include="*.js"`. 3. Look for cost tracking/monitoring: `grep -r "token_count\|usage_track\|cost_track\|billing\|token_usage\|prompt_tokens\|completion_tokens" --include="*.py" --include="*.ts"`. 4. Inspect environment/config files for API cost controls: check `.env`, `config.yaml`, `settings.py` for budget-related keys. 5. Verify that `max_tokens` is explicitly set (not relying on API defaults) in every LLM call site. |
| **Pass** | `max_tokens` is explicitly set on every LLM call. Per-user or per-session cost limits exist. Token usage is tracked and monitored. Budget alerts or circuit breakers are configured. |
| **Partial** | `max_tokens` is set but no per-user limits. Or cost tracking exists but no automatic cutoff when budgets are exceeded. |
| **Fail** | No `max_tokens` configuration — relying on API defaults. No cost tracking or budget limits. A single user could trigger unbounded API spend. |
| **Severity** | high |
| **Tech Triggers** | [openai, anthropic, any_ai_ml] |

---

### SAF-004: Rate Limiting on AI Endpoints

| Field | Value |
|---|---|
| **What to Look For** | Rate limiting on endpoints that trigger AI/LLM calls to prevent abuse, cost spikes, and denial-of-service. |
| **How to Check** | 1. Identify AI-powered endpoints: `grep -r "openai\|anthropic\|llm\|chat.*completion\|generate\|embed" --include="*.py" --include="*.ts" -l` — then check those files/routes for rate limiting. 2. Search for rate limiting middleware: `grep -r "rate_limit\|ratelimit\|throttle\|RateLimiter\|slowapi\|express-rate-limit\|bottleneck\|limiter" --include="*.py" --include="*.ts" --include="*.js"`. 3. Check for API gateway rate limiting config: `grep -r "rate" --include="*.yaml" --include="*.json" -l` in infrastructure/deployment directories. 4. Verify rate limits are more restrictive on AI endpoints than standard CRUD endpoints — AI calls are expensive and should have tighter limits. 5. Check for per-user vs. global rate limits: per-user is required, global is a bonus. |
| **Pass** | Rate limiting is applied to all AI-powered endpoints. Limits are per-user. AI endpoint limits are tighter than standard API limits. Configuration is explicit and documented. |
| **Partial** | Rate limiting exists but is global only (not per-user), or only covers some AI endpoints, or uses the same limits as non-AI endpoints. |
| **Fail** | No rate limiting on AI-powered endpoints. Users can make unlimited LLM calls. |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

---

## Risk Identification

Checks that ensure AI-specific risks are identified, documented, and
actively monitored. You can't mitigate what you haven't named.

---

### SAF-005: AI Risk Documentation

| Field | Value |
|---|---|
| **What to Look For** | Documented AI risks, limitations, known failure modes, and mitigation strategies. This is the team's shared understanding of what can go wrong. |
| **How to Check** | 1. Search for risk documentation: look for files named `*risk*`, `*limitation*`, `*safety*`, `*ai-policy*`, `*responsible-ai*` in docs/, README, or project root: `find . -iname "*risk*" -o -iname "*limitation*" -o -iname "*safety*" -o -iname "*responsible*" -o -iname "*ai-policy*"`. 2. Check README for an AI/ML limitations section: `grep -i "limitation\|risk\|caveat\|known issue\|failure mode\|not suitable" README*`. 3. Look for model cards or data sheets: `find . -iname "*model_card*" -o -iname "*datasheet*" -o -iname "*model-card*"`. 4. Check for inline risk annotations in code: `grep -r "WARNING\|RISK\|LIMITATION\|CAVEAT\|TODO.*safety\|FIXME.*safety" --include="*.py" --include="*.ts"`. 5. Verify documented risks cover at minimum: hallucination risk, data freshness, bias potential, cost overrun, availability dependency on third-party APIs. |
| **Pass** | Dedicated risk documentation exists covering AI-specific failure modes, limitations, and mitigation strategies. Risks are specific to the project (not generic boilerplate). Model cards or equivalent metadata exist for any fine-tuned or custom models. |
| **Partial** | Some risk documentation exists but is incomplete — e.g., README mentions limitations but no formal risk register, or risks are generic rather than project-specific. |
| **Fail** | No documented AI risks or limitations. The project treats the AI component as a black box with no acknowledged failure modes. |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |

---

### SAF-006: Bias Assessment

| Field | Value |
|---|---|
| **What to Look For** | Evidence of bias testing, fairness evaluation, or demographic analysis in the AI pipeline. Diverse test cases that cover different user populations. |
| **How to Check** | 1. Search for bias/fairness testing: `grep -r "bias\|fairness\|demographic\|equity\|disparate_impact\|protected_class\|sensitive_attribute" --include="*.py" --include="*.ts" --include="*.js"`. 2. Look for evaluation datasets with diverse inputs: check `tests/`, `eval/`, `data/` directories for test fixtures that include varied demographics, languages, or edge cases. 3. Check for fairness libraries: `grep -r "fairlearn\|aif360\|what-if-tool\|responsibleai\|evaluate.*bias" --include="*.py" --include="*.txt" --include="*.toml" --include="*.cfg"`. 4. Search test files for diverse test cases: `grep -r "test.*bias\|test.*fair\|test.*diverse\|test.*demographic" --include="*.py" --include="*.ts" --include="*.test.*"`. 5. Review prompt templates for inclusive language and check system prompts don't encode bias: `grep -r "system.*prompt\|SYSTEM_PROMPT\|system_message" --include="*.py" --include="*.ts"`. |
| **Pass** | Bias assessment process exists: diverse evaluation datasets, fairness metrics tracked, system prompts reviewed for bias. Results are documented and reviewed periodically. |
| **Partial** | Some awareness exists — e.g., diverse test cases but no formal fairness metrics, or bias mentioned in risk docs but no testing infrastructure. |
| **Fail** | No bias assessment. No diverse test data. No fairness evaluation. The AI pipeline has never been tested for biased outputs. |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |

---

### SAF-007: Data Privacy in AI Pipeline

| Field | Value |
|---|---|
| **What to Look For** | PII protection in the AI pipeline — ensuring personal data is not sent to external LLM APIs without consent, and that data masking/anonymization is applied before model inference. |
| **How to Check** | 1. Trace what data flows to the LLM: find all call sites to OpenAI/Anthropic/etc APIs and inspect what's in the prompt: `grep -rn "chat\.completions\|messages\.create\|ChatCompletion\|Anthropic\|client\.chat\|llm\.invoke\|chain\.run" --include="*.py" --include="*.ts"`. 2. Check for PII detection/masking before LLM calls: `grep -r "pii\|anonymize\|mask\|redact\|scrub\|sanitize.*data\|presidio\|private_ai\|data_mask" --include="*.py" --include="*.ts"`. 3. Look for data retention policies on AI providers: check if API calls use `store: false` or equivalent no-logging flags: `grep -r "store.*false\|no_log\|data_retention\|ephemeral" --include="*.py" --include="*.ts"`. 4. Check privacy documentation: `grep -ri "privacy\|gdpr\|pii\|personal data\|data protection" README* docs/*`. 5. Verify RAG pipelines don't index PII-containing documents without access controls: check vector store ingestion code for access filtering. |
| **Pass** | PII is detected and masked/redacted before being sent to external AI APIs. Data retention settings are configured (no-store flags). Privacy policy documents AI data handling. RAG ingestion respects access controls. |
| **Partial** | Some PII protection exists but is incomplete — e.g., masking on some fields but not all, or no-store flags set but no PII detection, or privacy docs don't cover AI-specific data flows. |
| **Fail** | No PII protection in the AI pipeline. User data (names, emails, sensitive content) is sent directly to external LLM APIs. No data retention configuration. No privacy documentation for AI components. |
| **Severity** | critical |
| **Tech Triggers** | [openai, anthropic, any_ai_ml] |

---

## Fail Safe

Checks that ensure the system degrades gracefully when AI components
fail, hallucinate, or produce low-confidence results. The system must
work (with reduced capability) without the AI.

---

### SAF-008: AI Graceful Degradation

| Field | Value |
|---|---|
| **What to Look For** | The system continues to function (with reduced capability) when AI/LLM services are unavailable — timeouts, API errors, quota exhaustion. |
| **How to Check** | 1. Search for error handling around AI calls: `grep -rn "try.*except\|catch\|\.catch\|error.*handler\|fallback\|timeout" --include="*.py" --include="*.ts" --include="*.js"` in files that contain LLM calls. 2. Check for timeout configuration on AI API calls: `grep -r "timeout\|request_timeout\|max_retries\|retry" --include="*.py" --include="*.ts"`. 3. Look for fallback paths: `grep -r "fallback\|default_response\|graceful.*degrad\|service_unavailable\|feature_flag.*ai\|ai.*disabled" --include="*.py" --include="*.ts"`. 4. Verify the UI/API still works if the AI provider returns 500/429/timeout — check for degraded-mode responses vs. hard crashes. 5. Check for circuit breaker patterns: `grep -r "circuit_breaker\|CircuitBreaker\|breaker\|half_open" --include="*.py" --include="*.ts"`. 6. Test: temporarily block AI API host in `/etc/hosts` or set an invalid API key — does the app crash or degrade gracefully? |
| **Pass** | All AI call sites have error handling with fallback behavior. Timeouts are configured. The system returns useful (if reduced) responses when AI is down. Circuit breaker or retry-with-backoff is implemented. |
| **Partial** | Error handling exists on most call sites but some paths crash on AI failure. Or fallback exists but returns generic errors instead of useful degraded responses. |
| **Fail** | No error handling around AI calls. AI service outage causes application crashes or unhandled 500 errors. No fallback behavior. |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

---

### SAF-009: Hallucination Mitigation

| Field | Value |
|---|---|
| **What to Look For** | Mechanisms to reduce and detect AI hallucinations — RAG with source grounding, citation requirements, confidence thresholds, fact-checking steps, or chain-of-verification patterns. |
| **How to Check** | 1. Check for RAG (Retrieval-Augmented Generation) implementation: `grep -r "retriev\|vector_store\|embeddings\|ChromaDB\|Pinecone\|Weaviate\|FAISS\|similarity_search\|RAG" --include="*.py" --include="*.ts"`. 2. Look for citation/source requirements in prompts: `grep -r "cite\|source\|reference\|based on.*context\|grounded\|only use.*provided" --include="*.py" --include="*.ts" --include="*.txt" --include="*.md"` in prompt templates. 3. Check for confidence thresholds or self-evaluation: `grep -r "confidence\|certainty\|score.*threshold\|verify\|fact.check\|chain.*verif" --include="*.py" --include="*.ts"`. 4. Look for "I don't know" handling — does the system instruct the model to refuse when uncertain: `grep -r "don't know\|cannot answer\|no information\|outside.*scope\|refuse\|abstain" --include="*.py" --include="*.ts" --include="*.txt"`. 5. Check for output validation against retrieved context: `grep -r "validate.*output\|check.*response\|verify.*answer\|faithfulness\|groundedness" --include="*.py" --include="*.ts"`. |
| **Pass** | RAG with source grounding is implemented. Prompts instruct the model to cite sources and refuse when uncertain. Output validation or faithfulness checks exist. The system does not present ungrounded claims as facts. |
| **Partial** | RAG exists but no citation enforcement. Or the system instructs the model to cite sources but doesn't validate that citations are real. Or confidence thresholds exist but are too permissive. |
| **Fail** | No hallucination mitigation. The model generates responses without any grounding, citation requirement, or confidence check. Users cannot distinguish AI-generated claims from verified facts. |
| **Severity** | high |
| **Tech Triggers** | [langchain, any_ai_ml] |

---

### SAF-010: Deterministic Fallback

| Field | Value |
|---|---|
| **What to Look For** | Rule-based or template-based fallback when AI confidence is low, responses are flagged by safety filters, or the AI component produces unusable output. |
| **How to Check** | 1. Search for fallback/default response logic: `grep -r "fallback\|default_response\|template_response\|rule_based\|static_response\|canned_response" --include="*.py" --include="*.ts" --include="*.js"`. 2. Check for confidence-based routing: `grep -r "confidence\|threshold\|score.*<\|low_quality\|uncertain\|below.*threshold" --include="*.py" --include="*.ts"`. 3. Look for response quality checks that trigger fallback: `grep -r "quality_check\|response_valid\|output_check\|is_valid.*response\|parse_error.*fallback" --include="*.py" --include="*.ts"`. 4. Verify the fallback response is actually useful — not just "An error occurred" but a helpful template or redirect to a human. 5. Check if safety-filtered responses trigger a fallback path rather than returning nothing: trace the code path from filter trigger to user response. |
| **Pass** | Deterministic fallback exists for low-confidence, flagged, or unparseable AI responses. Fallback provides useful information (templates, FAQ links, human handoff). Confidence thresholds are configured. |
| **Partial** | Fallback exists but is a generic error message. Or confidence-based routing exists in some paths but not all. |
| **Fail** | No deterministic fallback. When the AI fails to produce a good response, the system either returns the bad response or errors out. No confidence-based routing. |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |

---

## Hazard Warning

Checks that ensure the system communicates AI limitations, uncertainty,
and potential risks to the user. Users must know when they're
interacting with AI and what its boundaries are.

---

### SAF-011: AI Confidence Communication

| Field | Value |
|---|---|
| **What to Look For** | Confidence scores, uncertainty indicators, or reliability signals surfaced to the user alongside AI-generated responses. |
| **How to Check** | 1. Check if confidence scores are included in AI responses: `grep -r "confidence\|score\|certainty\|probability\|reliability\|uncertainty" --include="*.py" --include="*.ts" --include="*.js"` in response formatting/serialization code. 2. Look for UI components that display confidence: `grep -r "confidence\|reliability\|accuracy\|score" --include="*.tsx" --include="*.jsx" --include="*.vue" --include="*.html"`. 3. Check if model logprobs or confidence extraction is used: `grep -r "logprobs\|log_probs\|top_logprobs\|token_prob" --include="*.py" --include="*.ts"`. 4. Verify confidence is meaningful (not just always "high") — check for calibration or dynamic scoring. 5. Check API response schemas for confidence fields: `grep -r "confidence\|score\|reliability" --include="*.py" --include="*.ts"` in response model/schema definitions. |
| **Pass** | Confidence or uncertainty indicators are computed and surfaced to users. Indicators are meaningful and dynamic (not hardcoded). Users can gauge how much to trust each AI response. |
| **Partial** | Confidence is computed internally (e.g., for routing) but not surfaced to users. Or confidence is shown but is static/uninformative. |
| **Fail** | No confidence communication. All AI responses are presented with equal implied certainty regardless of actual model confidence. |
| **Severity** | medium |
| **Tech Triggers** | [any_ai_ml] |

---

### SAF-012: AI Limitation Disclosure

| Field | Value |
|---|---|
| **What to Look For** | Clear communication to users about what the AI can and cannot do — disclaimers, capability boundaries, known limitations, and terms of use for AI features. |
| **How to Check** | 1. Search for AI disclaimers in the UI: `grep -ri "disclaimer\|ai.*generated\|may not be accurate\|not.*substitute\|verify.*independently\|generated by\|powered by ai\|experimental" --include="*.tsx" --include="*.jsx" --include="*.html" --include="*.vue" --include="*.py" --include="*.ts"`. 2. Check for onboarding or first-use disclosure: look for modals, banners, or tooltips explaining AI capabilities in UI components. 3. Search for terms/docs covering AI usage: `find . -iname "*terms*" -o -iname "*disclaimer*" -o -iname "*ai-usage*" -o -iname "*acceptable-use*"`. 4. Verify the system prompt includes capability boundaries: `grep -r "system.*prompt\|SYSTEM_PROMPT\|system_message" --include="*.py" --include="*.ts"` — check if it defines what the AI should NOT do. 5. Check for user-facing docs on AI limitations: `grep -ri "limitation\|capability\|can.*cannot\|scope.*ai" docs/* README*`. |
| **Pass** | AI-generated content is clearly labeled. Disclaimers explain limitations. System prompt defines capability boundaries. User-facing documentation covers AI capabilities and limitations. |
| **Partial** | Some disclosure exists (e.g., a small label) but is easily missed or incomplete. Or system prompt limits the AI but users aren't informed of those limits. |
| **Fail** | No AI limitation disclosure. Users cannot tell what is AI-generated vs. human-curated. No disclaimers, no capability documentation. |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

---

### SAF-013: Harmful Output Warning

| Field | Value |
|---|---|
| **What to Look For** | Content warnings displayed when AI generates potentially sensitive, speculative, or controversial content. Proactive user notification rather than silent filtering. |
| **How to Check** | 1. Search for content warning mechanisms: `grep -r "content_warning\|sensitive\|trigger_warning\|nsfw\|mature_content\|flagged.*content\|warning.*label" --include="*.py" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx"`. 2. Check if safety filter results are communicated to users: trace what happens when SAF-001 output filters flag content — does the user get a warning, an explanation, or silent replacement? 3. Look for category-based flagging: `grep -r "category\|content_type\|sensitivity_level\|risk_level\|moderation.*result" --include="*.py" --include="*.ts"`. 4. Check for medical/legal/financial disclaimers when AI generates content in sensitive domains: `grep -ri "not.*medical\|not.*legal\|not.*financial\|consult.*professional\|seek.*advice" --include="*.py" --include="*.ts" --include="*.tsx" --include="*.html"`. 5. Verify warnings are user-visible (not just logged server-side). |
| **Pass** | Content warnings are shown when AI generates sensitive content. Domain-specific disclaimers exist (medical, legal, financial). Users are informed when content is flagged, replaced, or filtered. Warning UX is clear and non-dismissive. |
| **Partial** | Some warning mechanisms exist but are inconsistent — e.g., medical disclaimers but not legal. Or warnings are logged but not shown to users. |
| **Fail** | No content warnings. Sensitive or potentially harmful AI output is presented without any user notification. Filtered content is silently replaced with no explanation. |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

---

## Safe Integration

Checks that ensure AI components integrate safely into the larger
system — human oversight, audit trails, version tracking, and
accountability mechanisms.

---

### SAF-014: Human-in-the-Loop for Critical Actions

| Field | Value |
|---|---|
| **What to Look For** | AI cannot autonomously execute high-impact actions — deletions, financial transactions, external communications, permission changes, deployments. These require human approval. |
| **How to Check** | 1. Identify high-impact operations: `grep -r "delete\|destroy\|remove\|payment\|transfer\|send_email\|notify\|publish\|deploy\|permission\|role.*change\|admin" --include="*.py" --include="*.ts" --include="*.js"` — check if any are callable from AI code paths. 2. Trace AI decision → action chains: from AI output to side-effects, check for approval gates: `grep -r "approval\|confirm\|review\|human.*loop\|require.*approval\|pending.*review\|manual.*step" --include="*.py" --include="*.ts"`. 3. Look for the approval pattern: AI recommends → human reviews → human confirms → system executes: `grep -r "recommend\|suggest\|propose\|draft\|pending\|awaiting" --include="*.py" --include="*.ts"`. 4. Check for AI agent tool restrictions — if using an agent framework, verify tools with side-effects require confirmation: `grep -r "confirm\|require_approval\|human_approval\|ask_human\|HumanApprovalCallbackHandler" --include="*.py" --include="*.ts"`. 5. Verify there is NO code path where AI output directly triggers irreversible operations without a human gate. |
| **Pass** | All high-impact actions require explicit human approval before execution. AI can recommend/draft but not execute destructive or financially significant operations. Approval workflow is implemented with audit trail. |
| **Partial** | Human approval exists for some critical actions but not all. Or approval is implemented but can be auto-approved via configuration. |
| **Fail** | AI can autonomously trigger high-impact actions (deleting data, sending emails, making payments, changing permissions) without human review. |
| **Severity** | critical |
| **Tech Triggers** | [any_ai_ml] |

---

### SAF-015: Audit Trail for AI Decisions

| Field | Value |
|---|---|
| **What to Look For** | Comprehensive logging of AI interactions — inputs, outputs, model used, timestamp, user context, and decisions made. This is the accountability backbone. |
| **How to Check** | 1. Check for structured logging around AI calls: `grep -r "log.*prompt\|log.*response\|log.*completion\|ai.*log\|llm.*log\|audit.*log\|log.*model\|log.*inference" --include="*.py" --include="*.ts"`. 2. Look for dedicated AI audit/telemetry: `grep -r "telemetry\|audit_trail\|ai_audit\|decision_log\|langsmith\|langfuse\|wandb\|mlflow\|arize\|helicone" --include="*.py" --include="*.ts" --include="*.yaml" --include="*.env"`. 3. Verify logs capture: (a) full prompt or prompt hash, (b) model response, (c) model name/version, (d) user ID or session, (e) timestamp. Check log format. 4. Confirm logs are stored durably (not just stdout) — check for log shipping to a persistent store: `grep -r "log_file\|log_handler\|CloudWatch\|Datadog\|Splunk\|elastic\|BigQuery\|S3.*log" --include="*.py" --include="*.ts" --include="*.yaml"`. 5. Check for log retention policy: how long are AI decision logs kept? Is there a retention config? |
| **Pass** | AI interactions are logged with full context (input, output, model, user, timestamp). Logs are shipped to a durable store. Retention policy is defined. An observability platform (LangSmith, Langfuse, Helicone, etc.) or equivalent custom solution is in use. |
| **Partial** | Some logging exists but is incomplete — e.g., responses are logged but not prompts, or logs go to stdout but not a durable store. No retention policy. |
| **Fail** | No audit trail for AI decisions. AI inputs and outputs are not logged. No way to investigate what the AI said or why after the fact. |
| **Severity** | high |
| **Tech Triggers** | [any_ai_ml] |

---

### SAF-016: AI Model Version Tracking

| Field | Value |
|---|---|
| **What to Look For** | Each AI-generated output is traceable to the specific model version that produced it — model name, version, and configuration are recorded per interaction. |
| **How to Check** | 1. Check if model name/version is logged or stored with responses: `grep -r "model.*version\|model_name\|model_id\|engine\|gpt-4\|gpt-3\|claude\|model=" --include="*.py" --include="*.ts"` — verify it's captured alongside the response, not just at config time. 2. Look for model configuration management: `grep -r "MODEL_NAME\|MODEL_VERSION\|LLM_MODEL\|OPENAI_MODEL\|DEFAULT_MODEL" --include="*.env" --include="*.yaml" --include="*.py" --include="*.ts"`. 3. Check if model version is included in API responses or stored in the database: `grep -r "model.*field\|model.*column\|model.*attribute\|model_version" --include="*.py" --include="*.ts"` in model/schema definitions. 4. Verify model version changes are tracked (e.g., via config management, not hardcoded strings that change silently). 5. Check for A/B testing or canary deployment of models — if present, verify which model served which response is recorded. |
| **Pass** | Model name and version are recorded per AI interaction. Model config is managed (not hardcoded). Model version is included in audit logs and/or API responses. Model changes are trackable over time. |
| **Partial** | Model name is configured centrally but not logged per interaction. Or model version is logged but model changes aren't tracked (no history). |
| **Fail** | No model version tracking. Cannot determine which model version produced a given output. Model names are hardcoded across multiple files with no central management. |
| **Severity** | medium |
| **Tech Triggers** | [openai, anthropic, any_ai_ml] |

---

## Agentic AI Specific

Checks specific to AI agent systems — autonomous or semi-autonomous
AI components that can invoke tools, make multi-step decisions, and
interact with external systems. These carry higher safety risk than
simple prompt→response flows.

---

### SAF-017: Agent Action Boundaries

| Field | Value |
|---|---|
| **What to Look For** | AI agents have explicit, enforced capability boundaries — what tools they can call, what data they can access, what actions they can take. Principle of least privilege applied to AI agents. |
| **How to Check** | 1. Identify agent tool definitions: `grep -r "Tool\|tool_call\|function_call\|tools.*=\|available_tools\|toolkit\|@tool" --include="*.py" --include="*.ts"`. 2. Check if tools are explicitly enumerated (allowlist) vs. dynamically discovered: explicit enumeration is safer. 3. Look for tool permission/scope configuration: `grep -r "permission\|scope\|allow\|restrict\|boundary\|capability\|authorized_tools\|tool_whitelist\|allowed_tools" --include="*.py" --include="*.ts"`. 4. Verify data access boundaries: does the agent have unrestricted database access or is it scoped to specific tables/operations? Check ORM queries and database connection permissions in agent code. 5. Check for sandboxing: `grep -r "sandbox\|isolated\|container\|restricted_env\|safe_exec" --include="*.py" --include="*.ts"`. 6. Verify agents cannot escalate their own permissions — check that tool lists are static and not modifiable by the agent. |
| **Pass** | Tools are explicitly enumerated (allowlist). Data access is scoped (least privilege). Agents cannot modify their own tool list or escalate permissions. Boundaries are documented. Sensitive operations require approval (see SAF-014). |
| **Partial** | Tools are listed but too broad (e.g., generic "run_sql" without query restrictions). Or boundaries exist but aren't enforced programmatically (just prompt-based). |
| **Fail** | No explicit capability boundaries. Agent has unrestricted tool access. No data access scoping. Agent could theoretically call any function or access any data in the system. |
| **Severity** | critical |
| **Tech Triggers** | [langchain, any_ai_ml] |

---

### SAF-018: Agent Loop Prevention

| Field | Value |
|---|---|
| **What to Look For** | Maximum iteration limits, timeouts, and cost circuit breakers on AI agent execution loops to prevent runaway execution, infinite loops, and unbounded costs. |
| **How to Check** | 1. Search for iteration limits: `grep -r "max_iterations\|max_steps\|max_turns\|iteration_limit\|step_limit\|max_loops\|recursion_limit" --include="*.py" --include="*.ts"`. 2. Check for execution timeouts: `grep -r "timeout\|max_execution_time\|time_limit\|deadline\|max_time" --include="*.py" --include="*.ts"` in agent configuration. 3. Look for cost circuit breakers: `grep -r "max_cost\|cost_limit\|budget.*break\|spending.*limit\|token.*limit\|max_token.*total" --include="*.py" --include="*.ts"`. 4. Check LangChain/agent framework configuration for built-in limits: `grep -r "max_iterations\|early_stopping\|AgentExecutor.*max\|handle_parsing_errors" --include="*.py" --include="*.ts"`. 5. Verify limits are reasonable (not set to 999 or sys.maxsize): inspect the actual values configured. 6. Check for loop detection: `grep -r "loop_detect\|repeated.*action\|cycle.*detect\|stuck.*detect" --include="*.py" --include="*.ts"`. |
| **Pass** | Max iteration limit is set to a reasonable value. Execution timeout exists. Cost circuit breaker is configured. Loop detection catches repeated actions. All limits are tested (not set to effectively-infinite values). |
| **Partial** | Some limits exist but are incomplete — e.g., max_iterations set but no timeout, or timeout exists but no cost limit. Or limits are set to very high values (>100 iterations). |
| **Fail** | No iteration limits, timeouts, or cost circuit breakers on agent loops. An agent could run indefinitely, consuming unbounded API calls and cost. |
| **Severity** | high |
| **Tech Triggers** | [langchain, any_ai_ml] |

---

### SAF-019: Tool Call Validation

| Field | Value |
|---|---|
| **What to Look For** | AI agent tool calls are validated before execution — parameter type checking, value range validation, permission verification, and dangerous-input rejection. |
| **How to Check** | 1. Check for tool input validation: `grep -r "validate\|validator\|pydantic\|schema\|TypedDict\|input_schema\|args_schema\|param.*check\|param.*valid" --include="*.py" --include="*.ts"` in tool definition files. 2. Look for Pydantic models or JSON schemas on tool inputs: `grep -r "BaseModel\|Field\|validator\|field_validator\|model_validator" --include="*.py"` in tool files. 3. Check for dangerous input rejection — are SQL injection, path traversal, and command injection patterns caught in tool inputs: `grep -r "sanitize\|escape\|injection\|traversal\|dangerous\|forbidden\|blacklist\|denylist" --include="*.py" --include="*.ts"` in tool code. 4. Verify tool calls are logged before execution (see SAF-015): `grep -r "log.*tool\|tool.*log\|action.*log" --include="*.py" --include="*.ts"`. 5. Check for parameter range/boundary enforcement: do numeric parameters have min/max? Do string parameters have length limits? Inspect tool definitions for constraints. 6. Verify that tool call parsing errors are handled gracefully: `grep -r "parse_error\|invalid.*tool\|tool.*error\|OutputParserException" --include="*.py" --include="*.ts"`. |
| **Pass** | All tool inputs are validated with typed schemas (Pydantic, Zod, JSON Schema). Dangerous inputs are rejected. Parameter ranges are enforced. Tool calls are logged before execution. Parse errors trigger graceful fallback. |
| **Partial** | Some tools have input validation but not all. Or validation exists but is minimal (type checking only, no range/content validation). Or parse errors crash the agent. |
| **Fail** | No tool call validation. Agent-generated parameters are passed directly to tool functions without type checking, range validation, or sanitization. |
| **Severity** | high |
| **Tech Triggers** | [langchain, any_ai_ml] |

---

### SAF-020: Agent Observability

| Field | Value |
|---|---|
| **What to Look For** | Step-by-step logging of agent reasoning, tool selections, tool call parameters, tool results, and final output. Full visibility into the agent's decision-making process. |
| **How to Check** | 1. Check for agent tracing/observability platforms: `grep -r "langsmith\|langfuse\|arize\|phoenix\|wandb\|mlflow\|helicone\|callbacks\|tracer\|tracing" --include="*.py" --include="*.ts" --include="*.yaml" --include="*.env"`. 2. Look for verbose/debug logging on agent execution: `grep -r "verbose.*True\|verbose.*true\|debug.*True\|LANGCHAIN_TRACING\|LANGCHAIN_CALLBACKS" --include="*.py" --include="*.ts" --include="*.env"`. 3. Check for custom callback handlers: `grep -r "CallbackHandler\|BaseCallbackHandler\|on_tool_start\|on_tool_end\|on_llm_start\|on_chain_start\|on_agent_action" --include="*.py" --include="*.ts"`. 4. Verify each agent step is logged: (a) reasoning/thought, (b) chosen tool + parameters, (c) tool result, (d) next action decision. Check log output format. 5. Check if agent traces are queryable — can you look up a specific agent run and see all steps: `grep -r "run_id\|trace_id\|session_id\|agent_run\|execution_id" --include="*.py" --include="*.ts"`. 6. Verify traces persist beyond the request lifecycle — stored in a durable backend, not just memory. |
| **Pass** | Agent execution is fully traced with a dedicated observability platform (LangSmith, Langfuse, etc.) or comprehensive custom logging. Each step (thought → tool → result → next) is recorded. Traces are queryable by run ID. Traces persist in durable storage. |
| **Partial** | Some observability exists — e.g., verbose logging to stdout but no durable trace storage. Or tracing platform is configured but only captures start/end, not intermediate steps. |
| **Fail** | No agent observability. Agent runs are black boxes. Cannot inspect what tools were called, what parameters were used, or what the agent's reasoning was for a given interaction. |
| **Severity** | high |
| **Tech Triggers** | [langchain, any_ai_ml] |
