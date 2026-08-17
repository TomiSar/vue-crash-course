import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginView from '../../views/LoginView.vue';
import RegisterView from '../../views/RegisterView.vue';

const mockRouter = {
  push: vi.fn(),
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  RouterLink: {
    template: '<a><slot /></a>',
    props: ['to'],
  },
}));

describe('Auth views', () => {
  it('renders login form fields', () => {
    const wrapper = mount(LoginView, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>', props: ['to'] },
        },
      },
    });

    expect(wrapper.text()).toContain('Login');
    expect(wrapper.find('input[name="email"]').exists()).toBe(true);
    expect(wrapper.find('input[name="password"]').exists()).toBe(true);
  });

  it('renders register form fields', () => {
    const wrapper = mount(RegisterView, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>', props: ['to'] },
        },
      },
    });

    expect(wrapper.text()).toContain('Register');
    expect(wrapper.find('input[name="name"]').exists()).toBe(true);
    expect(wrapper.find('input[name="email"]').exists()).toBe(true);
    expect(wrapper.find('input[name="password"]').exists()).toBe(true);
  });
});
