import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveCrawledJobs } from '@/lib/jobs/jobEngine';

export const revalidate = 60; // 1 minute ISR caching

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const country = searchParams.get('country') || '';
    const sector = searchParams.get('sector') || 'All';
    const jobType = searchParams.get('jobType') || 'All';
    const isRemoteOnly = searchParams.get('isRemoteOnly') === 'true';
    const isGovernmentOnly = searchParams.get('isGovernmentOnly') === 'true';
    const sortBy = (searchParams.get('sortBy') as 'latest' | 'relevance') || 'latest';

    const jobs = await fetchLiveCrawledJobs({
      query,
      city,
      country,
      sector,
      jobType,
      isRemoteOnly,
      isGovernmentOnly,
      sortBy
    });

    return NextResponse.json({
      success: true,
      count: jobs.length,
      timestamp: new Date().toISOString(),
      jobs
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch job listings.',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
