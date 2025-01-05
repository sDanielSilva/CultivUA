import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Landing',
    iconName: 'home',
    bgcolor: 'primary',
    route: '/landingpage',
  },
  {
    displayName: 'Quiz',
    iconName: 'help-hexagon',
    bgcolor: 'primary',
    route: '/quiz',
  },
  {
    displayName: 'Quiz Pergunta',
    iconName: 'help-hexagon',
    bgcolor: 'primary',
    route: '/quizpergunta',
  },
  {
    displayName: 'Dashboard',
    iconName: 'category',
    bgcolor: 'primary',
    route: '/dashboard',
  },
  {
    displayName: 'Chat-Bot',
    iconName: 'help-hexagon',
    bgcolor: 'primary',
    route: '/chat',
  },
  {
    displayName: 'Admin',
    iconName: 'background',
    bgcolor: 'primary',
    route: '/dashboardAdmin',
  },
  {
    displayName: 'Blog',
    iconName: 'box-padding',
    bgcolor: 'primary',
    route: '/blog',
  },
  {
    displayName: 'Blog Post',
    iconName: 'box-padding',
    bgcolor: 'primary',
    route: '/blogpost',
  },
  {
    displayName: 'Contactos',
    iconName: 'address-book',
    bgcolor: 'primary',
    route: '/contactos',
  }
];
