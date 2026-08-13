import '../styles/main.scss';

const hamburger = document.querySelector('.page-nav__hamburger');
const navList = document.querySelector('.page-nav__ul');

hamburger?.addEventListener('click', () => {
  const isOpen = navList?.classList.toggle('is-open') ?? false;
  hamburger.setAttribute('aria-expanded', String(isOpen));
});
