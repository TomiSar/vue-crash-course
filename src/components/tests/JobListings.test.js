import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import JobListings from '../JobListings.vue';
import { fetchJobs } from '@/api/jobs';

const jobsMock = [
  {
    id: 1,
    title: 'Vue Frontend Developer',
    description:
      'A long description for the job that exceeds 90 characters. This is just the beginning of the description. More details about the job will be provided here.',
    type: 'Full-Time',
    salary: '$4000',
    location: 'Helsinki',
  },
  {
    id: 2,
    title: 'Java Backend Developer',
    description: 'Backend job description.',
    type: 'Part-Time',
    salary: '$3000',
    location: 'Espoo',
  },
  {
    id: 3,
    title: 'Web Fullstack Developer',
    description:
      'As a Fullstack Developer, you will work on both frontend and backend technologies to build robust web applications. You should be comfortable with TypeScript frameworks, REST APIs, and database management.',
    type: 'Full-Time',
    salary: '$6500',
    location: 'Tampere',
  },
  {
    id: 4,
    title: 'Intern',
    description: 'Internship job description.',
    type: 'Internship',
    salary: undefined,
    location: 'Oulu',
  },
];

vi.mock('@/api/jobs', () => ({
  fetchJobs: vi.fn(() => Promise.resolve(jobsMock)),
}));

const global = {
  stubs: {
    RouterLink: { template: '<a><slot /></a>' },
    JobListing: {
      template: '<div class="job-stub">{{ job.title }}</div>',
      props: ['job'],
    },
    PulseLoader: { template: '<div class="loader-stub"></div>' },
  },
};

describe('JobListings.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner while loading', async () => {
    fetchJobs.mockReturnValue(new Promise(() => {})); // Ikuinen lataus
    const wrapper = mount(JobListings, { global });
    expect(wrapper.find('.loader-stub').exists()).toBe(true);
  });

  it('fetches and renders jobs after loading', async () => {
    fetchJobs.mockResolvedValue(jobsMock);
    const wrapper = mount(JobListings, {
      global,
      props: { jobLimit: 4 },
    });
    await flushPromises();

    expect(wrapper.findAll('.job-stub').length).toBe(4);
    expect(wrapper.find('.loader-stub').exists()).toBe(false);
  });

  it('shows empty state message if list is empty', async () => {
    fetchJobs.mockResolvedValue([]);
    const wrapper = mount(JobListings, { global });
    await flushPromises();

    expect(wrapper.text()).toContain('No open jobs available');
    expect(wrapper.text()).toContain('Check back later for new opportunities.');
  });

  it('logs error on failed fetch', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchJobs.mockRejectedValue(new Error('Fetch failed'));

    mount(JobListings, { global });
    await flushPromises();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching jobs:',
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it('respects jobLimit prop', async () => {
    fetchJobs.mockResolvedValue(jobsMock);
    const wrapper = mount(JobListings, {
      props: { jobLimit: 2 },
      global,
    });
    await flushPromises();
    expect(wrapper.findAll('.job-stub').length).toBe(2);
  });

  it('renders "View All Jobs" button when showAllJobsButton is true', async () => {
    fetchJobs.mockResolvedValue(jobsMock);
    const wrapper = mount(JobListings, {
      props: { showAllJobsButton: true },
      global,
    });
    await flushPromises();
    expect(wrapper.text()).toContain('View All Jobs');
  });

  it('filters jobs by selected job type', async () => {
    fetchJobs.mockResolvedValue(jobsMock);
    const wrapper = mount(JobListings, { global });
    await flushPromises();

    const typeSelect = wrapper.find('select');
    await typeSelect.setValue('Full-Time');

    const jobs = wrapper.findAll('.job-stub');
    expect(jobs).toHaveLength(2);
    expect(wrapper.text()).toContain('Vue Frontend Developer');
    expect(wrapper.text()).toContain('Web Fullstack Developer');
    expect(wrapper.text()).not.toContain('Java Backend Developer');
  });

  it('shows empty state for a selected type with no matches', async () => {
    fetchJobs.mockResolvedValue(jobsMock);
    const wrapper = mount(JobListings, { global });
    await flushPromises();

    const typeSelect = wrapper.find('select');
    await typeSelect.setValue('Remote');

    expect(wrapper.text()).toContain('No open Remote jobs available');
  });

  describe('JobListings Sorting', () => {
    beforeEach(async () => {
      fetchJobs.mockResolvedValue(jobsMock);
    });

    it('sorts by title-asc and toggles off', async () => {
      const wrapper = mount(JobListings, {
        global,
        props: { jobLimit: 4 },
      });
      await flushPromises();

      const btn = wrapper.find('button:nth-of-type(1)'); // Title A-Z
      await btn.trigger('click');

      const jobs = wrapper.findAll('.job-stub');
      expect(jobs[0].text()).toBe('Intern');
      expect(jobs[1].text()).toBe('Java Backend Developer');
      expect(jobs[2].text()).toBe('Vue Frontend Developer');
      expect(jobs[3].text()).toBe('Web Fullstack Developer');
      expect(wrapper.text()).toContain('Filter title-asc');

      await btn.trigger('click');
      expect(wrapper.text()).toContain('Filter ');
    });

    it('sorts by title-desc', async () => {
      const wrapper = mount(JobListings, {
        global,
        props: { jobLimit: 4 },
      });
      await flushPromises();

      await wrapper.find('button:nth-of-type(2)').trigger('click'); // Title Z-A
      const jobs = wrapper.findAll('.job-stub');
      expect(jobs[0].text()).toBe('Web Fullstack Developer');
      expect(jobs[1].text()).toBe('Vue Frontend Developer');
      expect(jobs[2].text()).toBe('Java Backend Developer');
      expect(jobs[3].text()).toBe('Intern');
    });

    it('sorts by salary-asc', async () => {
      const wrapper = mount(JobListings, {
        global,
        props: { jobLimit: 4 },
      });
      await flushPromises();

      await wrapper.find('button:nth-of-type(3)').trigger('click'); // Salary Low-High
      const jobs = wrapper.findAll('.job-stub');

      expect(jobs[0].text()).toBe('Intern');
      expect(jobs[1].text()).toBe('Java Backend Developer');
      expect(jobs[2].text()).toBe('Vue Frontend Developer');
      expect(jobs[3].text()).toBe('Web Fullstack Developer');
    });

    it('sorts by salary-desc', async () => {
      const wrapper = mount(JobListings, {
        global,
        props: { jobLimit: 4 },
      });
      await flushPromises();

      await wrapper.find('button:nth-of-type(4)').trigger('click'); // Salary High-Low
      const jobs = wrapper.findAll('.job-stub');

      expect(jobs[0].text()).toBe('Web Fullstack Developer');
      expect(jobs[1].text()).toBe('Vue Frontend Developer');
      expect(jobs[2].text()).toBe('Java Backend Developer');
      expect(jobs[3].text()).toBe('Intern');
    });
  });

  describe('Job Limit Input', () => {
    it('allows user to change job limit via input field', async () => {
      fetchJobs.mockResolvedValue(jobsMock);
      const wrapper = mount(JobListings, { global });
      await flushPromises();

      const limitInput = wrapper.find('input[type="number"]');

      await limitInput.setValue(1);
      expect(wrapper.findAll('.job-stub')).toHaveLength(1);

      await limitInput.setValue(4);
      expect(wrapper.findAll('.job-stub')).toHaveLength(4);
    });

    it('updates max attribute based on filtered jobs length', async () => {
      fetchJobs.mockResolvedValue(jobsMock);
      const wrapper = mount(JobListings, { global });
      await flushPromises();

      const limitInput = wrapper.find('input[type="number"]');
      expect(limitInput.attributes('max')).toBe('4');

      const typeSelect = wrapper.find('select');
      await typeSelect.setValue('Internship');

      expect(limitInput.attributes('max')).toBe('1');
    });

    it('shows all jobs if jobLimit input is cleared (fallback to length)', async () => {
      fetchJobs.mockResolvedValue(jobsMock);
      const wrapper = mount(JobListings, { global });
      await flushPromises();

      const limitInput = wrapper.find('input[type="number"]');
      await limitInput.setValue('');

      expect(wrapper.findAll('.job-stub')).toHaveLength(4);
    });
  });
});
