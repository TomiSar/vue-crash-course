import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Card from '../Card.vue';

describe('Card.vue', () => {
  it('renders slot content', () => {
    const wrapper = mount(Card, {
      slots: {
        default: '<span>Test Content</span>',
      },
    });
    expect(wrapper.html()).toContain('Test Content');
  });

  it('applies default bgcolor class', () => {
    const wrapper = mount(Card);
    expect(wrapper.classes()).toContain('bg-gray-100');
  });

  it('applies custom bgcolor class', () => {
    const wrapper = mount(Card, {
      props: { bgcolor: 'bg-green-100' },
    });
    expect(wrapper.classes()).toContain('bg-green-100');
  });
});
