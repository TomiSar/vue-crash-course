import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BackButton from '../BackButton.vue';

// Mock RouterLink globally
const global = {
  stubs: {
    RouterLink: {
      template: '<a><slot /></a>',
    },
  },
};

describe('BackButton.vue', () => {
  it('renders Back to Job Listings text', () => {
    const wrapper = mount(BackButton, { global });
    expect(wrapper.text()).toContain('Back to Job Listings');
  });

  it('renders icon element', () => {
    const wrapper = mount(BackButton, { global });
    expect(wrapper.find('i.pi.pi-arrow-circle-left').exists()).toBe(true);
  });

  it('renders RouterLink with correct to prop', () => {
    const wrapper = mount(BackButton, { global });
    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
  });
});
