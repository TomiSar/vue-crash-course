import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import JobListing from '../JobListing.vue';

const jobMock = {
  title: 'Vue Frontend Developer',
  description:
    'A long description for the job that exceeds 90 characters. This is just the beginning of the description. More details about the job will be provided here.',
  type: 'Full-time',
  salary: '$4000',
  location: 'Helsinki',
};

const global = {
  stubs: {
    RouterLink: {
      template: '<a><slot /></a>',
    },
  },
};

describe('JobListing.vue', () => {
  it('renders job title, type, salary, and location', () => {
    const wrapper = mount(JobListing, {
      props: { job: jobMock },
      global,
    });
    expect(wrapper.text()).toContain(jobMock.title);
    expect(wrapper.text()).toContain(jobMock.type);
    expect(wrapper.text()).toContain(jobMock.salary);
    expect(wrapper.text()).toContain(jobMock.location);
  });

  it('shows truncated description by default', () => {
    const wrapper = mount(JobListing, {
      props: { job: jobMock },
      global,
    });
    expect(wrapper.text()).toContain(jobMock.description.substring(0, 90));
    expect(wrapper.text()).toContain('...');
  });

  it('toggles description on button click', async () => {
    const wrapper = mount(JobListing, {
      props: { job: jobMock },
      global,
    });
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(wrapper.text()).toContain(jobMock.description);
    expect(wrapper.text()).not.toContain('...');
    await button.trigger('click');
    expect(wrapper.text()).toContain(jobMock.description.substring(0, 90));
    expect(wrapper.text()).toContain('...');
  });

  it('renders RouterLinks for Read More and Edit Job', () => {
    const wrapper = mount(JobListing, {
      props: { job: jobMock },
      global,
    });
    const links = wrapper.findAll('a');
    expect(links.length).toBe(2);
  });
});
