import React, { useState } from 'react';
import { Task, ActiveTab, Priority } from './types';
import { Plus, Trash2, Edit2, CheckSquare, Square, Code2, BookOpenCheck, ListTodo, Search, Sparkles, RotateCcw, Calendar, AlertCircle, X, Check, PieChart, Filter } from 'lucide-react';
import { KOTLIN_CODE } from './data/kotlinCode';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  
  // Get today formatted as YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Estudiar Jetpack Compose', completed: true, dueDate: getTodayString(), priority: 'Alta', createdAt: new Date() },
    { id: '2', title: 'Hacer la tarea de matemáticas', completed: false, dueDate: getTodayString(), priority: 'Media', createdAt: new Date() },
    { id: '3', title: 'Comprar frutas para la merienda', completed: false, dueDate: getTodayString(), priority: 'Baja', createdAt: new Date() },
  ]);

  const [inputText, setInputText] = useState('');
  const [inputDate, setInputDate] = useState(getTodayString());
  const [inputPriority, setInputPriority] = useState<Priority>('Media');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'Todas' | Priority>('Todas');
  const [errorMessage, setErrorMessage] = useState('');

  // Edit State
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('Media');
  const [editError, setEditError] = useState('');

  const [darkMode, setDarkMode] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [activeCodeFile, setActiveCodeFile] = useState<'agendaScreen' | 'mainActivity' | 'taskModel'>('agendaScreen');
  const [copied, setCopied] = useState(false);

  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validation: cannot be empty or only spaces
    if (!inputText || !inputText.trim()) {
      setErrorMessage('Por favor, debes escribir una actividad.');
      return;
    }

    setErrorMessage('');
    const newTask: Task = {
      id: Date.now().toString(),
      title: inputText.trim(),
      completed: false,
      dueDate: inputDate || getTodayString(),
      priority: inputPriority,
      createdAt: new Date(),
    };

    setTasks([newTask, ...tasks]);
    setInputText('');
    setInputDate(getTodayString());
    setInputPriority('Media');
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDate(task.dueDate || getTodayString());
    setEditPriority(task.priority || 'Media');
    setEditError('');
  };

  const saveEditedTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editTitle || !editTitle.trim()) {
      setEditError('El título no puede estar vacío.');
      return;
    }

    if (!editingTask) return;

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: editTitle.trim(),
              dueDate: editDate || getTodayString(),
              priority: editPriority,
            }
          : task
      )
    );
    setEditingTask(null);
  };

  const resetDefaultTasks = () => {
    setTasks([
      { id: '1', title: 'Estudiar Jetpack Compose', completed: true, dueDate: getTodayString(), priority: 'Alta', createdAt: new Date() },
      { id: '2', title: 'Hacer la tarea de matemáticas', completed: false, dueDate: getTodayString(), priority: 'Media', createdAt: new Date() },
      { id: '3', title: 'Comprar frutas para la merienda', completed: false, dueDate: getTodayString(), priority: 'Baja', createdAt: new Date() },
    ]);
    setInputText('');
    setSearchQuery('');
    setPriorityFilter('Todas');
    setErrorMessage('');
  };

  // Filter tasks in real time based on search query and priority filter
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'Todas' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Progress calculations
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const progressPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const getPriorityBadgeColor = (priority: Priority) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'Media':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Baja':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-900'}`}>
      
      {/* Top Controls / Branding Bar */}
      <header className="w-full max-w-md py-3 px-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Mi Agenda</h1>
            <p className="text-[10px] text-emerald-400 font-medium">Android Jetpack Compose</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            {isPhoneFrame ? '📱 Marco Móvil' : '💻 Pantalla Completa'}
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            title="Cambiar tema"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Mobile Device Container */}
      <div 
        className={`w-full transition-all duration-300 flex flex-col ${
          isPhoneFrame 
            ? 'max-w-[390px] h-[840px] rounded-[48px] border-[8px] border-slate-800 shadow-2xl overflow-hidden relative my-2 bg-white dark:bg-slate-900' 
            : 'max-w-2xl h-[90vh] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative my-2 bg-white dark:bg-slate-900'
        }`}
      >
        {/* Android Status Bar */}
        <div className="bg-emerald-700 text-white pt-3 px-5 pb-2 flex justify-between items-center text-xs font-semibold select-none flex-shrink-0">
          <span>9:41</span>
          <div className="flex items-center space-x-1.5">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-current rounded-sm flex items-center p-0.5">
              <div className="w-full h-full bg-current rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* App Content Area based on Tab */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900 relative">
          
          {/* TAB 1: AGENDA (SIMULATOR / APP SCREEN) */}
          {activeTab === 'simulator' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Material 3 TopAppBar */}
              <div className="bg-emerald-600 text-white px-4 py-3.5 flex items-center justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5" />
                  <h2 className="text-base font-bold tracking-tight">Mi Agenda</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-100 font-mono">
                    {completedTasksCount}/{totalTasksCount}
                  </span>
                  <button
                    onClick={resetDefaultTasks}
                    title="Reiniciar lista"
                    className="p-1 text-emerald-100 hover:text-white rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3">
                
                {/* SUMMARY PROGRESS CARD */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3.5 rounded-2xl shadow-sm flex-shrink-0 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <PieChart className="w-3.5 h-3.5" />
                      <span>Progreso de Actividades</span>
                    </div>
                    <p className="text-[11px] text-emerald-100">
                      {completedTasksCount} de {totalTasksCount} completadas ({progressPercentage}%)
                    </p>
                    {/* Visual Progress Bar */}
                    <div className="w-36 h-2 bg-emerald-900/30 rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-500" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Circular Percentage Badge */}
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 flex-shrink-0">
                    <span className="text-xs font-bold font-mono">{progressPercentage}%</span>
                  </div>
                </div>

                {/* Search Bar in Real Time */}
                <div className="relative flex-shrink-0">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar actividad..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Priority Filter Selector (Todas, Alta, Media, Baja) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0">
                  <div className="flex items-center text-slate-400 text-[11px] font-medium pr-1">
                    <Filter className="w-3.5 h-3.5 mr-1" />
                    <span>Prioridad:</span>
                  </div>
                  {(['Todas', 'Alta', 'Media', 'Baja'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriorityFilter(p)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all flex-shrink-0 ${
                        priorityFilter === p
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {p === 'Todas' ? 'Todas' : p}
                    </button>
                  ))}
                </div>

                {/* Add Task Form with Date & Priority */}
                <form onSubmit={handleAddTask} className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2.5 flex-shrink-0">
                  <div>
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        if (errorMessage && e.target.value.trim()) setErrorMessage('');
                      }}
                      placeholder="Escribe una nueva actividad..."
                      className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition-all ${
                        errorMessage 
                          ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' 
                          : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:border-emerald-600'
                      }`}
                    />
                    {errorMessage && (
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-red-600 dark:text-red-400 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Date Picker */}
                    <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <input
                        type="date"
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                        className="w-full text-[11px] bg-transparent text-slate-700 dark:text-slate-200 outline-none"
                      />
                    </div>

                    {/* Priority Selector */}
                    <select
                      value={inputPriority}
                      onChange={(e) => setInputPriority(e.target.value as Priority)}
                      className="px-2.5 py-1.5 text-[11px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none font-medium"
                    >
                      <option value="Alta">🔴 Alta</option>
                      <option value="Media">🟡 Media</option>
                      <option value="Baja">🟢 Baja</option>
                    </select>

                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir</span>
                    </button>
                  </div>
                </form>

                {/* Empty State */}
                {filteredTasks.length === 0 && (
                  <div className="my-auto text-center py-8 px-4">
                    <Sparkles className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {searchQuery || priorityFilter !== 'Todas' ? 'No se encontraron actividades' : 'Sin actividades'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                      {searchQuery || priorityFilter !== 'Todas' ? 'Prueba cambiando los filtros de búsqueda o prioridad.' : 'Crea tu primera tarea arriba.'}
                    </p>
                    {!searchQuery && priorityFilter === 'Todas' && (
                      <button
                        onClick={resetDefaultTasks}
                        className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800"
                      >
                        Cargar ejemplos
                      </button>
                    )}
                  </div>
                )}

                {/* Tasks List */}
                <div className="space-y-2 pb-4">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-2xl border transition-all shadow-xs flex flex-col gap-2 ${
                        task.completed
                          ? 'bg-slate-100/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleTaskCompletion(task.id)}
                            className="text-emerald-600 hover:text-emerald-700 focus:outline-none transition-transform active:scale-90 flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          <span className={`text-xs font-medium truncate select-none ${task.completed ? 'line-through opacity-75' : ''}`}>
                            {task.title}
                          </span>
                        </div>

                        {/* Action Buttons: Edit & Delete */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditing(task)}
                            title="Editar"
                            className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            title="Eliminar"
                            className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Metadata Row: Date & Priority badge */}
                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full font-semibold border ${getPriorityBadgeColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KOTLIN CODE */}
          {activeTab === 'code' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 text-slate-100">
              <div className="bg-slate-900 px-3 py-2.5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
                <div className="flex gap-1 overflow-x-auto text-[11px]">
                  <button
                    onClick={() => setActiveCodeFile('agendaScreen')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${activeCodeFile === 'agendaScreen' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                  >
                    AgendaScreen.kt
                  </button>
                  <button
                    onClick={() => setActiveCodeFile('mainActivity')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${activeCodeFile === 'mainActivity' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                  >
                    MainActivity.kt
                  </button>
                  <button
                    onClick={() => setActiveCodeFile('taskModel')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${activeCodeFile === 'taskModel' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                  >
                    Task.kt
                  </button>
                </div>
              </div>

              <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center justify-between flex-shrink-0">
                <span>Kotlin & Jetpack Compose</span>
                <button
                  onClick={() => handleCopyCode(KOTLIN_CODE[activeCodeFile])}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-[10px] font-medium transition-colors"
                >
                  {copied ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                <pre className="text-[11px] font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">
                  <code>{KOTLIN_CODE[activeCodeFile]}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: GUIDE & EXPLANATION */}
          {activeTab === 'explanation' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-3.5 shadow-md">
                <h3 className="font-bold text-xs mb-1">Selector de Filtros por Prioridad</h3>
                <p className="text-[11px] text-emerald-100 leading-relaxed">
                  Se añadió una barra de filtros debajo del buscador para alternar rápidamente entre ver todas las tareas o filtrarlas por prioridad (Alta, Media y Baja).
                </p>
              </div>

              <div className="space-y-2">
                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">Filtrado Combinado</span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">Los filtros de prioridad operan en conjunto con la búsqueda en tiempo real para mayor precisión.</p>
                </div>
              </div>
            </div>
          )}

          {/* EDIT TASK MODAL OVERLAY */}
          {editingTask && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Editar Actividad</h3>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={saveEditedTask} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Título</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => {
                        setEditTitle(e.target.value);
                        if (editError && e.target.value.trim()) setEditError('');
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-600"
                    />
                    {editError && (
                      <span className="text-[10px] text-red-500 mt-0.5 block font-medium">{editError}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Fecha</label>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Prioridad</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as Priority)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none font-medium"
                    >
                      <option value="Alta">🔴 Alta</option>
                      <option value="Media">🟡 Media</option>
                      <option value="Baja">🟢 Baja</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingTask(null)}
                      className="flex-1 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Mobile Bottom Navigation Bar (Material 3 Navigation Bar) */}
          <nav className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex justify-around items-center flex-shrink-0 z-20">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                activeTab === 'simulator'
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <ListTodo className="w-5 h-5" />
              <span className="text-[10px]">Agenda</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                activeTab === 'code'
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <Code2 className="w-5 h-5" />
              <span className="text-[10px]">Código</span>
            </button>

            <button
              onClick={() => setActiveTab('explanation')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                activeTab === 'explanation'
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <BookOpenCheck className="w-5 h-5" />
              <span className="text-[10px]">Guía UI</span>
            </button>
          </nav>
        </div>

        {/* Home Indicator Bar */}
        <div className="bg-white dark:bg-slate-900 pb-2 pt-1 flex justify-center flex-shrink-0">
          <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
