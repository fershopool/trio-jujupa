// Animación del árbol a instrumentos: al llegar, centra la vista y la reproduce.
// Sin JS o con movimiento reducido no se añade la clase js y se ve el estado final estático.
(() => {
  const arbol = document.getElementById('arbol');
  if (!arbol || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  arbol.classList.add('js');
  let espera;
  const reproducir = () => {
    arbol.scrollIntoView({ behavior: 'smooth', block: 'start' }); // respeta scroll-padding-top (la barra)
    arbol.classList.remove('dibuja');
    void arbol.offsetWidth; // fuerza reflujo para reiniciar los keyframes
    arbol.classList.add('dibuja');
  };

  const io = new IntersectionObserver(([e]) => {
    clearTimeout(espera);
    // La pausa evita atrapar a quien solo pasa de largo hacia otra sección
    if (e.isIntersecting) espera = setTimeout(() => { io.disconnect(); reproducir(); }, 350);
  }, { threshold: .35 });
  io.observe(arbol);

  arbol.querySelector('.repetir')?.addEventListener('click', reproducir);
})();
