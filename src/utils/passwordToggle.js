export function passwordToggle(container) {
  if (!container) return;

  container.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.password-control');
    if (!toggleBtn) return;

    const targetName = toggleBtn.dataset.target;
    const passwordInput = document.getElementById(targetName);

    if (passwordInput) {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      toggleBtn.classList.toggle('password-control--isvisible');
      toggleBtn.setAttribute('aria-label', isHidden ? 'Скрыть пароль' : 'Показать пароль');
      passwordInput.focus();
    }
  });
}
