import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Navbar from '../Navbar.vue';

const { mockAuthState, mockRouter, mockLogoutUser } = vi.hoisted(() => ({
  mockAuthState: {
    isAuthenticated: true,
    isAdmin: true,
    user: { name: 'Admin' },
  },
  mockRouter: { push: vi.fn() },
  mockLogoutUser: vi.fn().mockResolvedValue(undefined),
}));

let mockRoutePath = '/';

vi.mock('vue-router', () => ({
  useRoute: () => ({ path: mockRoutePath }),
  useRouter: () => mockRouter,
  RouterLink: {
    template: '<a><slot /></a>',
  },
}));

vi.mock('@/store/auth', () => ({
  authState: mockAuthState,
  logoutUser: mockLogoutUser,
}));

vi.mock('@/assets/img/logo.png', () => ({
  default: 'logo-stub.png',
}));

describe('Navbar.vue', () => {
  beforeEach(() => {
    mockRoutePath = '/';
    mockAuthState.isAuthenticated = true;
    mockAuthState.isAdmin = true;
    mockAuthState.user = { name: 'Admin' };
    mockRouter.push.mockClear();
    mockLogoutUser.mockClear();
    mockLogoutUser.mockResolvedValue(undefined);
  });

  it('renders logo and all navigation links for an authenticated admin', () => {
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

  it('renders login and register links for an unauthenticated user', () => {
    mockAuthState.isAuthenticated = false;
    mockAuthState.isAdmin = false;
    mockAuthState.user = null;

    const wrapper = mount(Navbar);

    expect(wrapper.get('[data-testid="login-link"]').text()).toBe('Login');
    expect(wrapper.get('[data-testid="register-link"]').text()).toBe(
      'Register',
    );
    expect(wrapper.find('[data-testid="home-link"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="add-job-link"]').exists()).toBe(false);
  });

  it('shows the default user name when the authenticated user has no name', () => {
    mockAuthState.isAuthenticated = true;
    mockAuthState.isAdmin = false;
    mockAuthState.user = {};

    const wrapper = mount(Navbar);

    expect(wrapper.text()).toContain('User');
  });

  it('logs the user out and redirects to home', async () => {
    const wrapper = mount(Navbar);

    await wrapper.get('button').trigger('click');

    expect(mockLogoutUser).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
