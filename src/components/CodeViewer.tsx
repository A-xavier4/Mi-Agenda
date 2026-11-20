import React, { useState } from 'react';
import { KOTLIN_CODE } from '../data/kotlinCode';
import { Copy, Check, FileCode, Terminal, BookOpen } from 'lucide-react';

type CodeFileKey = 'agendaScreen' | 'mainActivity' | 'taskModel';

export default function CodeViewer() {
  const [activeFile, setActiveFile] = useState<CodeFileKey>('agendaScreen');
  const [copied, setCopied] = useState(false);

  const files: { key: CodeFileKey; label: string; filename: string; description: string }[] = [
    {
      key: 'agendaScreen',
      label: 'Pantalla Principal',
      filename: 'AgendaScreen.kt',
      description: 'Contiene la interfaz de usuario con la barra superior, campo de texto, botón y lista de tareas.'
    },
    {
      key: 'mainActivity',
      label: 'Actividad Principal',
      filename: 'MainActivity.kt',
      description: 'Punto de entrada de la app Android que inicializa Jetpack Compose y el tema visual.'
    },
    {
      key: 'taskModel',
      label: 'Modelo de Datos',
      filename: 'Task.kt',
      description: 'Estructura de datos (data class) que define qué información guarda cada actividad.'
    },
  ];

  const currentCode = KOTLIN_CODE[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-sm mb-1">Código fuente en Kotlin y Jetpack Compose</h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Estos son los archivos oficiales que puedes copiar directamente a Android Studio para crear tu aplicación "Mi Agenda". Están diseñados especialmente para principiantes, con nombres claros y comentarios explicativos.
          </p>
        </div>
      </div>

      {/* File Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {files.map((file) => (
          <button
            key={file.key}
            onClick={() => setActiveFile(file.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeFile === file.key
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>{file.filename}</span>
          </button>
        ))}
      </div>

      {/* Code Container */}
      <div className="bg-slate-950 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs font-mono text-slate-400">
              {files.find((f) => f.key === activeFile)?.filename}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar código</span>
              </>
            )}
          </button>
        </div>

        {/* Description Banner */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800/60 text-xs text-slate-400 font-mono">
          // {files.find((f) => f.key === activeFile)?.description}
        </div>

        {/* Code Content */}
        <div className="p-5 overflow-x-auto max-h-[500px]">
          <pre className="text-xs sm:text-sm font-mono text-emerald-300 leading-relaxed">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
