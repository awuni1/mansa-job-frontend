import { NextRequest, NextResponse } from 'next/server';
import {
    parseResume,
    calculateJobMatch,
    generateJobDescription,
    parseSearchQuery,
    generateInterviewQuestions,
    getSalaryInsights
} from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, data } = body;

        switch (action) {
            case 'parseResume':
                const parsedResume = await parseResume(data.resumeText);
                return NextResponse.json({ success: true, data: parsedResume });

            case 'matchJob':
                const matchResult = await calculateJobMatch(data.candidateProfile, data.jobRequirements);
                return NextResponse.json({ success: true, data: matchResult });

            case 'generateJobDescription':
                const jobDescription = await generateJobDescription(data.jobInfo);
                return NextResponse.json({ success: true, data: jobDescription });

            case 'parseSearch':
                const searchFilters = await parseSearchQuery(data.query);
                return NextResponse.json({ success: true, data: searchFilters });

            case 'generateInterviewQuestions':
                const questions = await generateInterviewQuestions(
                    data.role,
                    data.skills,
                    data.experienceLevel
                );
                return NextResponse.json({ success: true, data: questions });

            case 'getSalaryInsights':
                const insights = await getSalaryInsights(
                    data.role,
                    data.location,
                    data.experienceLevel
                );
                return NextResponse.json({ success: true, data: insights });

            default:
                return NextResponse.json(
                    { success: false, error: 'Unknown action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('AI API error:', error);
        return NextResponse.json(
            { success: false, error: 'AI processing failed' },
            { status: 500 }
        );
    }
}
