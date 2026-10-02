# ToolVerse — API, Server Dependencies & Ethical Writing Audit

## 📜 Writing, Grammar & Academic Integrity Tools Status Matrix

| Tool | Status | Browser/API/Server | Actual Provider | Environment Variables Required | Test Status | Publicly Visible | Academic-Integrity Disclaimer Added |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Readability Score Checker** | `live` | Browser | Client JS Math Engine | None | Passed | Yes | Yes |
| **Repeated Word Finder** | `live` | Browser | Client JS Engine | None | Passed | Yes | Yes |
| **Duplicate Phrase Finder** | `live` | Browser | Client JS Engine | None | Passed | Yes | Yes |
| **Passive Voice Finder** | `live` | Browser | Client JS Heuristic | None | Passed | Yes | Yes |
| **Sentence Length Checker** | `live` | Browser | Client JS Heuristic | None | Passed | Yes | Yes |
| **Academic Tone Checker** | `live` | Browser | Client JS Rule Engine | None | Passed | Yes | Yes |
| **Citation Checklist** | `live` | Browser | Client Pattern Engine | None | Passed | Yes | Yes |
| **Reference List Alphabetizer** | `live` | Browser | Client String Sorter | None | Passed | Yes | Yes |
| **Citation Formatter (APA/MLA)** | `live` | Browser | Client Citation Engine | None | Passed | Yes | Yes |
| **Essay Structure Checker** | `live` | Browser | Client Structure Engine | None | Passed | Yes | Yes |
| **Thesis Statement Checklist** | `live` | Browser | Client Heuristic Engine | None | Passed | Yes | Yes |
| **Transition Word Helper** | `live` | Browser | Client Data Catalog | None | Passed | Yes | Yes |
| **Formal Tone Converter** | `live` | Browser | Client Dictionary Rules | None | Passed | Yes | Yes |
| **Simple English Converter** | `live` | Browser | Client Vocabulary Engine | None | Passed | Yes | Yes |
| **Email Proofreading Checklist** | `live` | Browser | Client LocalStorage | None | Passed | Yes | Yes |
| **Assignment Submission Checklist** | `live` | Browser | Client LocalStorage | None | Passed | Yes | Yes |
| **Originality Checklist** | `live` | Browser | Educational Self-Check | None | Passed | Yes | Yes |
| **Grammar & Spell Checker** | `admin_configuration_required` | API Proxy | LanguageTool / Grammar API | `GRAMMAR_API_KEY`, `GRAMMAR_API_URL` | Passed (API fallback check) | Yes (Unconfigured Notice) | Yes |
| **Writing Proofreader** | `admin_configuration_required` | API Proxy | LanguageTool / Grammar API | `GRAMMAR_API_KEY` | Passed (API fallback check) | Yes (Unconfigured Notice) | Yes |
| **Paraphrasing Tool** | `admin_configuration_required` | API Proxy | Configured LLM (OpenAI / Anthropic) | `LLM_API_KEY`, `LLM_PROVIDER` | Passed (Consent & API check) | Yes (Consent Required) | Yes |
| **Natural Writing Rewriter** | `admin_configuration_required` | API Proxy | Configured LLM (OpenAI / Anthropic) | `LLM_API_KEY` | Passed (Notice check) | Yes (Notice Required) | Yes |
| **Sentence Improver** | `admin_configuration_required` | API Proxy | Configured LLM (OpenAI / Anthropic) | `LLM_API_KEY` | Passed (API fallback check) | Yes (Unconfigured Notice) | Yes |
| **Writing Pattern Indicator** | `admin_configuration_required` | API Proxy | Pattern Signal Provider | `AI_WRITING_INDICATOR_API_KEY` | Passed (Warning check) | Yes (Warning Notice) | Yes |
| **Web Similarity Checker** | `admin_configuration_required` | API Proxy | Custom Web Search Provider | `SIMILARITY_SEARCH_API_KEY` | Passed (API fallback check) | Yes (Unconfigured Notice) | Yes |
| **Academic Plagiarism Checker** | `disabled` | Server | Licensed Academic Corpus | None (Requires Contract) | Passed (Disabled Status) | Yes (Disabled Notice) | Yes |

---

## 🛡️ Critical Ethical & Academic Integrity Commitments

1. **Zero AI Bypass / Turnitin Evasion:** ToolVerse explicitly rejects AI-detector bypass marketing, Turnitin evasion claims, or deceptive "undetectable AI" services.
2. **Mandatory User Rights Confirmation:** Rephrasing and paraphrasing tools require explicit user consent confirming they possess rights to edit the text and will comply with university policies.
3. **Imperfect Pattern Signal Disclosure:** The Writing Pattern Indicator is prominently labeled as an imperfect statistical signal that must NEVER be used to penalize students or form academic accusations.
4. **No Fake Scores:** Institutional plagiarism checking remains disabled by default until licensed database access is legally authorized.
