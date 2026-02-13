# AI Compatibility Scoring Setup

## Overview
The AI compatibility feature allows recruiters to see how compatible each applicant is with a job posting based on skill matching. The system computes a 0-100% compatibility score and displays compatibility labels (Highly compatible, Compatible, Low compatibility).

## Features
- **Automatic Skill Matching**: Compares applicant skills vs. job required skills
- **AI-Powered (Optional)**: Uses Gemini embeddings for semantic skill matching if configured
- **Fallback Mode**: Falls back to simple skill overlap if AI is not configured
- **Sorting & Filtering**: Recruiters can sort applications by compatibility score (High→Low or Low→High)
- **Visual Feedback**: Color-coded progress bars (green=80%+, yellow=50-79%, red=<50%)

## Backend Configuration

### 1. Set up Gemini API Key (Optional but Recommended)

Add to `services/utils/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_URL=https://your-gemini-embedding-endpoint
GEMINI_MODEL=embedding-001
```

The job service will load this shared `.env` automatically.

### 2. Without Gemini (Fallback Mode)

If `GEMINI_API_KEY` and `GEMINI_API_URL` are not set, the system will use a simple skill overlap algorithm:
- Normalizes skills to lowercase
- Counts matching skills
- Returns `(matches / required_skills) * 100`

## API Endpoint

### Get Applications with Compatibility Scores
```
GET /api/job/application/:jobId
Authorization: Bearer {token}
Headers: { "Authorization": "Bearer <recruiter_token>" }
```

**Response Example:**
```json
[
  {
    "application_id": 1,
    "job_id": 5,
    "applicant_id": 42,
    "applicant_email": "john@example.com",
    "status": "Submitted",
    "resume": "https://...",
    "applied_at": "2026-02-14T10:00:00Z",
    "subscribed": true,
    "compatibility_score": 85,
    "compatibility_label": "Highly compatible"
  },
  {
    "application_id": 2,
    "job_id": 5,
    "applicant_id": 43,
    "applicant_email": "jane@example.com",
    "status": "Submitted",
    "resume": "https://...",
    "applied_at": "2026-02-14T10:05:00Z",
    "subscribed": false,
    "compatibility_score": 45,
    "compatibility_label": "Low compatibility"
  }
]
```

## Frontend Usage

### Viewing Applications with Compatibility Scores

1. **Navigate to Job Details** (Recruiter only): `/jobs/:jobId`
2. **See Applications Section**: Shows all applications for the job
3. **Sort by Compatibility**:
   - Default: Order by subscription status and application date
   - High → Low: Best matches first
   - Low → High: Poorest matches first
4. **Visual Indicator**: Each application displays:
   - Compatibility score (%)
   - Color-coded bar (green/yellow/red)
   - Label (Highly compatible / Compatible / Low compatibility)

## How the Scoring Works

### Simple Skill Overlap (Fallback)
```
score = (matched_skills / required_skills) × 100
```

Example:
- Job requires: [React, TypeScript, Node.js]
- Applicant has: [React, Python, Node.js]
- Matched: 2 (React, Node.js)
- Score: (2/3) × 100 = 67%
- Label: "Compatible"

### AI-Powered Scoring (with Gemini)
- Embeds job skills and applicant skills as vectors
- Computes cosine similarity between embeddings
- Returns semantic match percentage
- More accurate for related skills (e.g., "React" vs. "Vue" both frontend)

## Implementation Files

- **Backend Utility**: `services/job/src/utils/ai.ts`
  - `computeCompatibility()`: Main function (tries AI, falls back to simple)
  - `simpleSkillScore()`: Skill overlap algorithm
  - `computeCompatibilityWithAI()`: Gemini embedding call

- **Backend Controller**: `services/job/src/controllers/job.ts`
  - `getAllApplicationForJob()`: Fetches and computes scores

- **Frontend Types**: `frontend/src/type.ts`
  - `Application` interface now includes `compatibility_score` and `compatibility_label`

- **Frontend UI**: `frontend/src/app/jobs/[id]/page.tsx`
  - Displays compatibility bar per application
  - Sort dropdown controls

## Testing

### 1. Manual Test (Simple Skill Overlap)
No env vars needed. Backend uses simple algorithm by default.

### 2. Test with Gemini (if configured)
1. Set `GEMINI_API_KEY` and `GEMINI_API_URL` in `services/utils/.env`
2. Restart job service: `npm run dev`
3. Fetch applications: `GET /api/job/application/<jobId>`
4. Verify `compatibility_score` and `compatibility_label` in response

### 3. Frontend Test
1. Log in as recruiter
2. View a job you posted
3. See "Applications" section
4. Use "Sort" dropdown to reorder by compatibility
5. Check color-coded bars

## Label Thresholds

| Score Range | Label | Color |
|-------------|-------|-------|
| 80–100 | Highly compatible | Green |
| 50–79 | Compatible | Yellow |
| 0–49 | Low compatibility | Red |

## Future Enhancements

- [ ] Store computed scores in DB to reduce compute time
- [ ] Filter applications by compatibility label
- [ ] Email summaries highlighting top matches
- [ ] Bulk actions on high-compatibility candidates
- [ ] Custom scoring weights (e.g., experience years, education)

## Troubleshooting

**Issue**: `compatibility_score` is always 0 or missing
- Ensure the job has `skills` set when created
- Verify applicant has added skills to profile

**Issue**: Cannot connect to Gemini API
- Check `GEMINI_API_KEY` and `GEMINI_API_URL` are correct
- Verify network access to the endpoint
- Check logs for detailed error messages

**Issue**: Scores are always high/low
- Simple algorithm is in use (no AI configured) – expected behavior
- Review skill normalization (case-sensitivity, whitespace)

