import { describe, it, expect } from 'vitest';
import { 
  filterJobListings, 
  GLOBAL_MASTER_JOBS_DATABASE 
} from '../lib/jobs/jobEngine';

describe('Job Engine & Crawler Tests', () => {
  it('should filter jobs by keyword correctly', () => {
    const filtered = filterJobListings(GLOBAL_MASTER_JOBS_DATABASE, { query: 'React' });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(j => 
      j.title.toLowerCase().includes('react') || 
      j.description.toLowerCase().includes('react') ||
      j.tags.some(t => t.toLowerCase().includes('react'))
    )).toBe(true);
  });

  it('should filter jobs by city correctly', () => {
    const filtered = filterJobListings(GLOBAL_MASTER_JOBS_DATABASE, { city: 'Karachi' });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(j => j.city.toLowerCase().includes('karachi') || j.location.toLowerCase().includes('karachi'))).toBe(true);
  });

  it('should filter jobs by country correctly for Pakistan', () => {
    const filtered = filterJobListings(GLOBAL_MASTER_JOBS_DATABASE, { country: 'Pakistan' });
    expect(filtered.length).toBeGreaterThanOrEqual(10);
  });

  it('should filter jobs by remote status', () => {
    const filtered = filterJobListings(GLOBAL_MASTER_JOBS_DATABASE, { isRemoteOnly: true });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(j => j.isRemote)).toBe(true);
  });
});
