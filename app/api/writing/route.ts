import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, text, userConsent, mode } = body;

    const maxLen = parseInt(process.env.MAX_TEXT_LENGTH || '50000', 10);
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text content is required.' }, { status: 400 });
    }

    if (text.length > maxLen) {
      return NextResponse.json(
        { error: `Text length exceeds maximum allowed limit of ${maxLen} characters.` },
        { status: 400 }
      );
    }

    // Ethical check for rewrite / paraphrasing tools
    if (['paraphrasing-tool', 'natural-writing-rewriter'].includes(action)) {
      if (!userConsent) {
        return NextResponse.json(
          {
            error:
              'User confirmation required: You must confirm you have rights to edit this text and will comply with academic integrity policies.',
          },
          { status: 400 }
        );
      }
    }

    // Check provider environment keys
    const llmKey = process.env.LLM_API_KEY;
    const grammarKey = process.env.GRAMMAR_API_KEY;
    const similarityKey = process.env.SIMILARITY_SEARCH_API_KEY;
    const indicatorKey = process.env.AI_WRITING_INDICATOR_API_KEY;

    if (action === 'academic-plagiarism-checker') {
      return NextResponse.json(
        {
          status: 'disabled',
          message:
            'Academic Plagiarism Checker is disabled. Access to licensed academic database provider is required for ethical compliance. No fake scores or unverified database claims are served.',
          disclaimer:
            'ToolVerse does not provide unverified plagiarism scores or fake Turnitin comparisons.',
        },
        { status: 503 }
      );
    }

    // If no external API keys configured, return success with client fallback indicator
    return NextResponse.json({
      status: 'success',
      action,
      mode: mode || 'standard',
      isOfflineFallback: true,
      disclaimer:
        'Review all generated text carefully before submitting. Ensure proper attribution and compliance with your institution policy.',
    });
        'Review all generated text carefully before submitting. Ensure proper attribution and compliance with your institution policy.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error processing writing API.' }, { status: 500 });
  }
}
