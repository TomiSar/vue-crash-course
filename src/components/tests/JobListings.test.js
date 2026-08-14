import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import JobListings from '../JobListings.vue';
import { fetchJobs } from '@/api/jobs';

const jobsMock = [
  {
    id: 1,
    title: 'Vue Frontend Developer',
    description:
      'A long description for the job that exceeds 90 characters. This is just the beginning of the description. More details about the job will be provided here.',
    type: 'Full-time',
    salary: '$4000',
    location: 'Helsinki',
  },
  {
    id: 2,
    title: 'Java Backend Developer',
    description: 'Backend job description.',
    type: 'Part-time',
    salary: '$3000',
    location: 'Espoo',
  },
  {
    id: 3,
    title: 'Web Fullstack Developer',
    description:
      'As a Fullstack Developer, you will work on both frontend and backend technologies to build robust web applications. You should be comfortable with TypeScript frameworks, REST APIs, and database management.',
    type: 'Full-time',
    salary: '$6500',
    location: 'Tampere',
  },
];

vi.mock('@/api/jobs', () => ({
  fetchJobs: vi.fn(() => Promise.resolve(jobsMock)),
}));

const global = {
  stubs: {
    RouterLink: {
      template: '<a><slot /></a>',
    },
    JobListing: {
      template: '<div class="job-listing">JobListingStub</div>',
      props: ['job'],
    },
    PulseLoader: true,
  },
};

describe('JobListings.vue', () => {
  it('fetches and renders jobs', async () => {
    const wrapper = mount(JobListings, {
      props: { jobLimit: 2 },
      global,
    });
    await flushPromises();
    expect(wrapper.findAll('.job-listing').length).toBe(2);
  });

  it('shows loading spinner while loading', async () => {
    let resolve;
    const fetchPromise = new Promise((r) => (resolve = r));
    fetchJobs.mockImplementation(() => fetchPromise);
    const wrapper = mount(JobListings, { global });
    expect(wrapper.find('pulse-loader-stub').exists()).toBe(true);
    resolve(jobsMock);
    await flushPromises();
  });

  it('shows "View All Jobs" button if showAllJobsButton is true', async () => {
    const wrapper = mount(JobListings, {
      props: { showAllJobsButton: true },
      global,
    });
    await flushPromises();
    expect(wrapper.text()).toContain('View All Jobs');
  });
});
