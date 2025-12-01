'use client';

import { useEffect } from 'react';

export function useVYLOAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const vyloPage = document.querySelector('.vylo-page');
    if (vyloPage) {
      vyloPage.querySelectorAll('.vylo-animate').forEach(el => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);
}
