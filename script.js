document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".ramo");

  // Cargar progreso desde localStorage
  const progresoGuardado = JSON.parse(localStorage.getItem("progresoRamos") || "{}");

  function actualizarProgreso() {
    const total = botones.length;
    const aprobados = document.querySelectorAll(".ramo.aprobado").length;
    const progreso = (aprobados / total) * 100;
    document.getElementById("progreso-barra").style.width = progreso + "%";
  }

  function guardarProgreso() {
    const progreso = {};
    botones.forEach(btn => {
      progreso[btn.id] = btn.classList.contains("aprobado");
    });
    localStorage.setItem("progresoRamos", JSON.stringify(progreso));
  }

  // Aplicar estado guardado
  botones.forEach(boton => {
    if (progresoGuardado[boton.id]) {
      boton.classList.add("aprobado");
      boton.disabled = true;
    }
  });

  // Revisar desbloqueo al cargar
  botones.forEach(b => {
    const prereqs = b.dataset.prereq?.split(",") || [];
    if (prereqs.length > 0) {
      const todosAprobados = prereqs.every(id =>
        progresoGuardado[id] === true
      );
      if (todosAprobados) b.disabled = false;
    }
  });

  botones.forEach(boton => {
    const prereq = boton.dataset.prereq;
    if (prereq && !progresoGuardado[boton.id]) boton.disabled = true;

    boton.addEventListener("click", () => {
      if (boton.classList.contains("aprobado")) return;

      boton.classList.add("aprobado");
      boton.disabled = true;

      botones.forEach(b => {
        const prereqs = b.dataset.prereq?.split(",") || [];
        if (prereqs.includes(boton.id)) {
          const todosAprobados = prereqs.every(id => {
            const prereqBtn = document.getElementById(id);
            return prereqBtn && prereqBtn.classList.contains("aprobado");
          });
          if (todosAprobados) b.disabled = false;
        }
      });

      guardarProgreso();
      actualizarProgreso();
    });
  });

  actualizarProgreso();
});
