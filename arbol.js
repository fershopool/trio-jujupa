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
    seguir();
  };
  // Mientras corre, el botón permite saltar al resultado
  const boton = arbol.querySelector('.repetir');
  let turno = 0;
  const enCurso = () => arbol.getAnimations({ subtree: true });
  const seguir = () => {
    const este = ++turno;
    boton.textContent = 'Saltar animación';
    Promise.allSettled(enCurso().map(x => x.finished)).then(() => {
      if (este === turno) boton.textContent = 'Repetir animación';
    });
  };

  const io = new IntersectionObserver(([e]) => {
    clearTimeout(espera);
    // La pausa evita atrapar a quien solo pasa de largo hacia otra sección
    if (e.isIntersecting) espera = setTimeout(() => { io.disconnect(); reproducir(); }, 350);
  }, { threshold: .35 });
  io.observe(arbol);

  boton.addEventListener('click', () => {
    if (boton.textContent.startsWith('Saltar')) enCurso().forEach(x => x.finish());
    else { io.disconnect(); reproducir(); }
  });
})();
