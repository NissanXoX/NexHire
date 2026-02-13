import axios from "axios";
function dot(a, b) {
    return a.reduce((s, v, i) => s + v * (b[i] ?? 0), 0);
}
function norm(a) {
    return Math.sqrt(a.reduce((s, v) => s + v * v, 0));
}
function cosine(a, b) {
    if (!a.length || !b.length)
        return 0;
    const d = dot(a, b);
    const n = norm(a) * norm(b);
    return n === 0 ? 0 : d / n;
}
// Simple fallback: skill overlap percentage
export function simpleSkillScore(jobSkills = [], applicantSkills = []) {
    const normalize = (arr) => arr.map((s) => (s || "").toLowerCase().trim());
    const j = normalize(jobSkills);
    const a = normalize(applicantSkills);
    if (j.length === 0)
        return 0;
    const intersection = j.filter((s) => a.includes(s));
    return Math.round((intersection.length / j.length) * 100);
}
// Tries to use GEMINI_API_URL + GEMINI_API_KEY to get embeddings for two texts and returns 0-100 score.
export async function computeCompatibilityWithAI(jobText, applicantText) {
    const url = process.env.GEMINI_API_URL;
    const key = process.env.GEMINI_API_KEY;
    if (!url || !key) {
        return null;
    }
    try {
        // Provider-specific contract required; expect the endpoint to return embeddings array for input texts
        const resp = await axios.post(url, { inputs: [jobText, applicantText], model: process.env.GEMINI_MODEL || "gemini" }, { headers: { Authorization: `Bearer ${key}` }, timeout: 20000 });
        const data = resp.data;
        // Expecting data.embeddings = [[...], [...]] or data[0].embedding shape
        let e1;
        let e2;
        if (Array.isArray(data.embeddings) && data.embeddings.length >= 2) {
            e1 = data.embeddings[0];
            e2 = data.embeddings[1];
        }
        else if (Array.isArray(data) && data.length >= 2 && data[0].embedding) {
            e1 = data[0].embedding;
            e2 = data[1].embedding;
        }
        if (!e1 || !e2)
            return null;
        const sim = cosine(e1, e2);
        return Math.round(sim * 100);
    }
    catch (err) {
        console.error("AI compatibility call failed", err instanceof Error ? err.message : err);
        return null;
    }
}
export async function computeCompatibility(jobSkills = [], applicantSkills = [], applicantText = "") {
    // Try AI first (if configured)
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_URL) {
        const jobText = jobSkills.join(" ");
        const applicant = applicantText || applicantSkills.join(" ");
        const aiScore = await computeCompatibilityWithAI(jobText, applicant);
        if (typeof aiScore === "number")
            return aiScore;
    }
    // fallback to simple skill overlap
    return simpleSkillScore(jobSkills, applicantSkills);
}
export default { computeCompatibility, simpleSkillScore };
