document.addEventListener('DOMContentLoaded', function() {
  const avatar = document.querySelector('.avatar');
  const avatarContainer = document.querySelector('.avatar-container');
  const buttons = document.querySelectorAll('.animation-buttons button');

  const animations = {
    pulse: 'pulse 3s ease-in-out infinite',
    bounce: 'bounce 2s ease-in-out infinite',
    rotate: 'rotate 4s linear infinite',
    fade: 'avatarFade 3s ease-in-out infinite'
  };

  let activeAnimations = ['pulse']; // Default to pulse

  // Set initial animation
  updateAnimation();

  buttons.forEach(button => {
    const animation = button.id.replace('-btn', '');
    if (activeAnimations.includes(animation)) {
      button.classList.add('active');
    }
    button.addEventListener('click', function() {
      if (activeAnimations.includes(animation)) {
        activeAnimations = activeAnimations.filter(a => a !== animation);
        this.classList.remove('active');
      } else {
        activeAnimations.push(animation);
        this.classList.add('active');
      }
      updateAnimation();
    });
  });

  function updateAnimation() {
    if (activeAnimations.length === 0) {
      avatar.style.animation = 'none';
      avatarContainer.classList.remove('speaking');
    } else {
      avatar.style.animation = activeAnimations.map(a => animations[a]).join(', ');
      avatarContainer.classList.add('speaking');
    }
  }
});
