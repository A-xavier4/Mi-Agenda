import React from 'react';
import { Layout, Smartphone, CheckCircle, Code, Layers, Sparkles } from 'lucide-react';

export default function ExplanationGuide() {
  const componentsList = [
    {
      name: 'Scaffold (Estructura base)',
      desc: 'Proporciona el diseño visual estándar de Material Design, incluyendo la barra superior (TopAppBar) y el manejo de espacios.',
      icon: Layout,
    },
    {
      name: 'Column (Diseño vertical)',
      desc: 'Organiza los elementos hijos uno debajo del otro en orden vertical (el campo de entrada arriba y la lista de tareas abajo).',
      icon: Layers,
    },
    {
      name: 'Row (Fila horizontal)',
      desc: 'Se usa para alinear horizontalmente el campo de texto y el botón de "Agregar actividad" uno al lado del otro.',
      icon: Smartphone,
    },
    {
      name: 'OutlinedTextField (Campo de texto)',
      desc: 'Permite al usuario escribir el título de la nueva actividad con un borde elegante y etiqueta flotante.',
      icon: Code,
    },
    {
      name: 'Button (Botón de acción)',
      desc: 'Captura el toque del usuario para agregar la actividad escrita a la lista de tareas pendientes.',
      icon: Sparkles,
    },
    {
      name: 'LazyColumn (Lista eficiente)',
      desc: 'Muestra la lista de actividades de forma optimizada, cargando en memoria únicamente los elementos visibles en la pantalla.',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      {/* Introduction Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3">¿Cómo se organiza la pantalla en Jetpack Compose?</h2>
        <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl">
          Jetpack Compose utiliza un enfoque declarativo: describes cómo debe verse tu interfaz según el estado actual (por ejemplo, la lista de tareas). No necesitas modificar manualmente las vistas; Compose actualiza la pantalla automáticamente cuando cambian los datos.
        </p>
      </div>

      {/* Component breakdown */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <span>Elementos de la interfaz paso a paso</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {componentsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-1">{item.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Beginner Tips */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>Consejos para alumnos que recién empiezan</span>
        </h3>
        <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">1</span>
            <span><strong>El Estado (State):</strong> Usamos <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-emerald-700">remember</code> y <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-emerald-700">mutableStateOf</code> para que Android recuerde las actividades agregadas mientras la aplicación está abierta.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">2</span>
            <span><strong>Inmutabilidad:</strong> Cada vez que agregamos o borramos una tarea, creamos una nueva lista en lugar de modificar la anterior. Esto evita errores difíciles de detectar.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">3</span>
            <span><strong>Android Studio:</strong> Puedes copiar los fragmentos de código de la pestaña "Código Fuente" y pegarlos en tu proyecto nuevo de Android Studio con plantilla Empty Compose Activity.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
