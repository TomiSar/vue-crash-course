import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Navbar from '../Navbar.vue';

// Mock vue-router and allow dynamic useRoute return value
let mockRoutePath = '/';
vi.mock('vue-router', () => ({
  useRoute: () => ({ path: mockRoutePath }),
  RouterLink: {
    template: '<a><slot /></a>',
  },
}));

describe('Navbar.vue', () => {
  beforeEach(() => {
    mockRoutePath = '/';
  });

  it('renders logo and all navigation links', () => {
    mockRoutePath = '/';
    const wrapper = mount(Navbar);
    expect(wrapper.find('img[alt="Vue Jobs"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="home-link"]').text()).toBe('Home');
    expect(wrapper.get('[data-testid="jobs-link"]').text()).toBe('Jobs');
    expect(wrapper.get('[data-testid="add-job-link"]').text()).toBe('Add Job');
  });

  it('highlights Home link when on /', () => {
    mockRoutePath = '/';
    const wrapper = mount(Navbar);
    const homeLink = wrapper.get('[data-testid="home-link"]');
    expect(homeLink.classes()).toContain('bg-green-900');
  });

  it('highlights Jobs link when on /jobs', () => {
    mockRoutePath = '/jobs';
    const wrapper = mount(Navbar);
    const jobsLink = wrapper.get('[data-testid="jobs-link"]');
    expect(jobsLink.classes()).toContain('bg-green-900');
  });

  it('highlights Add Job link when on /jobs/add', () => {
    mockRoutePath = '/jobs/add';
    const wrapper = mount(Navbar);
    const addJobLink = wrapper.get('[data-testid="add-job-link"]');
    expect(addJobLink.classes()).toContain('bg-green-900');
  });
});
