import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Hero from '../Hero.vue';

describe('Hero.vue', () => {
  it('renders default title and description', () => {
    const wrapper = mount(Hero);
    expect(wrapper.text()).toContain('Become a Vue Developer');
    expect(wrapper.text()).toContain(
      'Find the Vue job that fits your skills and needs',
    );
  });

  it('renders custom title and description', () => {
    const wrapper = mount(Hero, {
      props: {
        title: 'Test Title',
        description: 'Test Description',
      },
    });
    expect(wrapper.text()).toContain('Test Title');
    expect(wrapper.text()).toContain('Test Description');
  });
});
