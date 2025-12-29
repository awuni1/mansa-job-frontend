/**
 * Google Gemini AI Client for Mansa Jobs
 * Provides AI-powered features for job matching, resume parsing, and more
 */

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Validate API key availability
if (!GOOGLE_AI_API_KEY) {
    console.warn('Warning: GOOGLE_AI_API_KEY is not set. AI features will not work.');
}

interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{ text: string }>;
        };
    }>;
}

/**
 * Generate content using Gemini AI
 */
export async function generateContent(prompt: string): Promise<string> {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_AI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 2048,
                }
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data: GeminiResponse = await response.json();
        return data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
        console.error('Gemini AI error:', error);
        throw error;
    }
}

/**
 * Parse resume text and extract structured data
 */
export async function parseResume(resumeText: string): Promise<ParsedResume> {
    const prompt = `Parse the following resume and extract structured data. Return ONLY valid JSON with no markdown formatting.

Resume:
${resumeText}

Return JSON in this exact format:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+1234567890",
  "location": "City, Country",
  "headline": "Professional Title",
  "summary": "Brief professional summary",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "startDate": "2020-01",
      "endDate": "2023-12",
      "description": "Job description"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "field": "Field of Study",
      "year": "2020"
    }
  ]
}`;

    const result = await generateContent(prompt);

    // Extract JSON from response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Could not parse resume data');
    }

    return JSON.parse(jsonMatch[0]) as ParsedResume;
}

/**
 * Calculate job match score between candidate and job
 */
export async function calculateJobMatch(
    candidateProfile: CandidateProfile,
    jobRequirements: JobRequirements
): Promise<JobMatchResult> {
    const prompt = `Analyze the match between this candidate and job. Return ONLY valid JSON.

CANDIDATE:
Skills: ${candidateProfile.skills.join(', ')}
Experience: ${candidateProfile.yearsExperience} years
Location: ${candidateProfile.location}
Desired Salary: ${candidateProfile.desiredSalary}

JOB REQUIREMENTS:
Title: ${jobRequirements.title}
Required Skills: ${jobRequirements.skills.join(', ')}
Experience: ${jobRequirements.experienceLevel}
Location: ${jobRequirements.location}
Salary Range: ${jobRequirements.salaryRange}

Return JSON:
{
  "matchScore": 85,
  "skillsMatch": ["matched skill 1", "matched skill 2"],
  "missingSkills": ["missing skill 1"],
  "recommendation": "Brief recommendation",
  "strengths": ["strength 1", "strength 2"],
  "gaps": ["gap 1"]
}`;

    const result = await generateContent(prompt);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Could not calculate job match');
    }

    return JSON.parse(jsonMatch[0]) as JobMatchResult;
}

/**
 * Generate job description from basic info
 */
export async function generateJobDescription(
    jobInfo: JobInfo
): Promise<GeneratedJobDescription> {
    const prompt = `Generate a professional job description. Return ONLY valid JSON.

JOB INFO:
Title: ${jobInfo.title}
Company: ${jobInfo.company}
Location: ${jobInfo.location}
Type: ${jobInfo.type}
Key Requirements: ${jobInfo.requirements.join(', ')}

Return JSON:
{
  "title": "Job Title",
  "description": "2-3 paragraph job description",
  "responsibilities": ["responsibility 1", "responsibility 2", "responsibility 3", "responsibility 4", "responsibility 5"],
  "requirements": ["requirement 1", "requirement 2", "requirement 3", "requirement 4", "requirement 5"],
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"],
  "skills": ["skill 1", "skill 2", "skill 3"]
}`;

    const result = await generateContent(prompt);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Could not generate job description');
    }

    return JSON.parse(jsonMatch[0]) as GeneratedJobDescription;
}

/**
 * Smart search - parse natural language query
 */
export async function parseSearchQuery(query: string): Promise<SearchFilters> {
    const prompt = `Parse this job search query and extract filters. Return ONLY valid JSON.

Query: "${query}"

Return JSON:
{
  "keywords": ["keyword1", "keyword2"],
  "location": "City or Remote",
  "jobType": "full_time or part_time or contract or remote",
  "experienceLevel": "entry or mid or senior",
  "salaryMin": 50000,
  "salaryMax": 100000,
  "skills": ["skill1", "skill2"]
}

Use null for fields that cannot be determined from the query.`;

    const result = await generateContent(prompt);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return { keywords: query.split(' '), location: null, jobType: null, experienceLevel: null, salaryMin: null, salaryMax: null, skills: [] };
    }

    return JSON.parse(jsonMatch[0]) as SearchFilters;
}

/**
 * Generate interview questions for a role
 */
export async function generateInterviewQuestions(
    role: string,
    skills: string[],
    experienceLevel: string
): Promise<InterviewQuestion[]> {
    const prompt = `Generate 10 interview questions for this role. Return ONLY valid JSON array.

Role: ${role}
Skills: ${skills.join(', ')}
Experience Level: ${experienceLevel}

Return JSON array:
[
  {
    "question": "Question text",
    "type": "technical or behavioral or situational",
    "difficulty": "easy or medium or hard",
    "tips": "Answer tips"
  }
]`;

    const result = await generateContent(prompt);
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
        return [];
    }

    return JSON.parse(jsonMatch[0]) as InterviewQuestion[];
}

/**
 * Generate salary insights
 */
export async function getSalaryInsights(
    role: string,
    location: string,
    experienceLevel: string
): Promise<SalaryInsight> {
    const prompt = `Provide salary insights for this role in Africa. Return ONLY valid JSON.

Role: ${role}
Location: ${location}
Experience: ${experienceLevel}

Return JSON (amounts in USD):
{
  "role": "Role Name",
  "location": "Location",
  "currency": "USD",
  "salaryRange": {
    "min": 40000,
    "median": 60000,
    "max": 90000
  },
  "factors": ["factor affecting salary 1", "factor 2"],
  "marketTrend": "growing or stable or declining",
  "demandLevel": "high or medium or low"
}`;

    const result = await generateContent(prompt);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Could not get salary insights');
    }

    return JSON.parse(jsonMatch[0]) as SalaryInsight;
}

// Type definitions
export interface ParsedResume {
    name: string;
    email: string;
    phone: string;
    location: string;
    headline: string;
    summary: string;
    skills: string[];
    experience: Array<{
        company: string;
        role: string;
        startDate: string;
        endDate: string;
        description: string;
    }>;
    education: Array<{
        institution: string;
        degree: string;
        field: string;
        year: string;
    }>;
}

export interface CandidateProfile {
    skills: string[];
    yearsExperience: number;
    location: string;
    desiredSalary: string;
}

export interface JobRequirements {
    title: string;
    skills: string[];
    experienceLevel: string;
    location: string;
    salaryRange: string;
}

export interface JobMatchResult {
    matchScore: number;
    skillsMatch: string[];
    missingSkills: string[];
    recommendation: string;
    strengths: string[];
    gaps: string[];
}

export interface JobInfo {
    title: string;
    company: string;
    location: string;
    type: string;
    requirements: string[];
}

export interface GeneratedJobDescription {
    title: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
    skills: string[];
}

export interface SearchFilters {
    keywords: string[];
    location: string | null;
    jobType: string | null;
    experienceLevel: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    skills: string[];
}

export interface InterviewQuestion {
    question: string;
    type: 'technical' | 'behavioral' | 'situational';
    difficulty: 'easy' | 'medium' | 'hard';
    tips: string;
}

export interface SalaryInsight {
    role: string;
    location: string;
    currency: string;
    salaryRange: {
        min: number;
        median: number;
        max: number;
    };
    factors: string[];
    marketTrend: 'growing' | 'stable' | 'declining';
    demandLevel: 'high' | 'medium' | 'low';
}
