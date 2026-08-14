import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HomeCards from '../HomeCards.vue';

const global = {
  stubs: {
    RouterLink: {
      template: '<a><slot /></a>',
      props: ['to'],
    },
    Card: {
      template: '<div><slot /></div>',
      props: ['bgcolor'],
    },
  },
};

describe('HomeCards.vue', () => {
  it('renders both cards and correct link texts', () => {
    const wrapper = mount(HomeCards, { global });
    expect(wrapper.text()).toContain('For Developers');
    expect(wrapper.text()).toContain('For Employers');
    const links = wrapper.findAll('a');
    expect(links.length).toBe(2);
    expect(links[0].text()).toBe('Browse Jobs');
    expect(links[1].text()).toBe('Add Job');
  });
});
