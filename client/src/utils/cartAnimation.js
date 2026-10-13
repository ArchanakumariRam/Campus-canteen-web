// Flying Food Particle & Cart Jiggle Animation Helper
export function animateAddToCart(sourceElement, dish) {
  // Find cart destination target
  const cartBtn = document.querySelector('.cart-toggle-btn') || document.querySelector('.nav-plate-sticky-btn');
  if (!cartBtn) return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = cartBtn.getBoundingClientRect();

  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  // Create flying avatar clone
  const flyer = document.createElement('div');
  flyer.className = 'cart-flyer-clone';
  flyer.style.cssText = `
    position: fixed;
    z-index: 99999;
    left: ${startX - 24}px;
    top: ${startY - 24}px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-image: url('${dish.image || ''}');
    background-size: cover;
    background-position: center;
    border: 2px solid #ffffff;
    box-shadow: 0 8px 24px rgba(217, 35, 45, 0.6);
    pointer-events: none;
    transition: transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.65s ease, scale 0.65s ease;
    transform: scale(1);
    opacity: 1;
  `;

  // Fallback icon if dish has no image
  if (!dish.image) {
    flyer.textContent = '🍽️';
    flyer.style.display = 'flex';
    flyer.style.alignItems = 'center';
    flyer.style.justifyContent = 'center';
    flyer.style.background = '#d9232d';
    flyer.style.fontSize = '1.4rem';
  }

  document.body.appendChild(flyer);

  // Trigger animation next frame
  requestAnimationFrame(() => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    flyer.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.35)`;
    flyer.style.opacity = '0.4';
  });

  // When flyer lands: bounce the cart button and show +1 badge
  setTimeout(() => {
    flyer.remove();

    // Jiggle/bounce effect on cart button
    cartBtn.classList.remove('cart-bounce-active');
    void cartBtn.offsetWidth; // Force reflow
    cartBtn.classList.add('cart-bounce-active');

    // Floating +1 particle
    const plusOne = document.createElement('div');
    plusOne.className = 'cart-plus-one-float';
    plusOne.textContent = '+1';
    plusOne.style.cssText = `
      position: fixed;
      z-index: 100000;
      left: ${endX}px;
      top: ${endY - 20}px;
      color: #ffffff;
      background: #10b981;
      font-weight: 900;
      font-size: 0.82rem;
      padding: 2px 7px;
      border-radius: 99px;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
      animation: floatUpFade 0.7s forwards ease-out;
    `;
    document.body.appendChild(plusOne);

    setTimeout(() => plusOne.remove(), 750);
  }, 620);
}
