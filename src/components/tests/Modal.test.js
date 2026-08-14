import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Modal from '../Modal.vue';

describe('Modal.vue', () => {
  it('does not render when isOpen is false', () => {
    const wrapper = mount(Modal, {
      props: { isOpen: false },
    });
    expect(wrapper.find('.fixed').exists()).toBe(false);
  });

  it('renders correctly with default props when isOpen is true', () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true },
    });
    expect(wrapper.find('h2').text()).toBe('Confirm');
    expect(wrapper.find('p').text()).toBe('');

    const buttons = wrapper.findAll('button');
    expect(buttons[0].text()).toBe('Cancel');
    expect(buttons[1].text()).toBe('Yes');
  });

  it('renders custom titles and messages', () => {
    const wrapper = mount(Modal, {
      props: {
        isOpen: true,
        title: 'Test Job',
        message: 'Are you sure?',
        confirmText: 'Delete Now',
        cancelText: 'Go Back',
      },
    });

    expect(wrapper.find('h2').text()).toBe('Test Job');
    expect(wrapper.find('p').text()).toBe('Are you sure?');

    const buttons = wrapper.findAll('button');
    expect(buttons[0].text()).toBe('Go Back');
    expect(buttons[1].text()).toBe('Delete Now');
  });

  it('emits "cancel" event when cancel button is clicked', async () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true },
    });

    await wrapper.findAll('button')[0].trigger('click');

    expect(wrapper.emitted()).toHaveProperty('cancel');
    expect(wrapper.emitted('cancel').length).toBe(1);
  });

  it('emits "confirm" event when confirm button is clicked', async () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true },
    });

    await wrapper.findAll('button')[1].trigger('click');

    expect(wrapper.emitted()).toHaveProperty('confirm');
    expect(wrapper.emitted('confirm').length).toBe(1);
  });

  it('emits "cancel" event when backdrop is clicked', async () => {
    const wrapper = mount(Modal, {
      props: { isOpen: true },
    });

    await wrapper.find('.bg-black').trigger('click');

    expect(wrapper.emitted()).toHaveProperty('cancel');
    expect(wrapper.emitted('cancel').length).toBe(1);
  });
});
