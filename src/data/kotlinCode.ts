export const KOTLIN_CODE = {
  mainActivity: `package com.example.miagenda

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import com.example.miagenda.ui.screens.AgendaScreen
import com.example.miagenda.ui.theme.MiAgendaTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MiAgendaTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AgendaScreen()
                }
            }
        }
    }
}`,

  agendaScreen: `package com.example.miagenda.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.miagenda.model.Priority
import com.example.miagenda.model.Task
import java.time.LocalDate

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AgendaScreen() {
    var tasks by remember { mutableStateOf(listOf<Task>()) }
    var taskTitle by remember { mutableStateOf("") }
    var taskDueDate by remember { mutableStateOf(LocalDate.now().toString()) }
    var taskPriority by remember { mutableStateOf(Priority.MEDIA) }
    var searchQuery by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf("") }

    // Estado para edición
    var editingTask by remember { mutableStateOf<Task?>(null) }
    var editTitle by remember { mutableStateOf("") }
    var editDueDate by remember { mutableStateOf("") }
    var editPriority by remember { mutableStateOf(Priority.MEDIA) }

    // Filtrar tareas en tiempo real
    const val filteredTasks = tasks.filter { 
        it.title.contains(searchQuery, ignoreCase = true) 
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Mi Agenda") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Barra de búsqueda en tiempo real
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                label = { Text("Buscar actividad...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            // Formulario de ingreso de nueva actividad
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = taskTitle,
                    onValueChange = { 
                        taskTitle = it 
                        if (it.isNotBlank()) errorMessage = ""
                    },
                    label = { Text("Nueva actividad") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    isError = errorMessage.isNotEmpty()
                )

                if (errorMessage.isNotEmpty()) {
                    Text(
                        text = errorMessage,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Selector simple de prioridad
                    DropdownMenuPriority(
                        selected = taskPriority,
                        onSelected = { taskPriority = it },
                        modifier = Modifier.weight(1f)
                    )

                    Button(
                        onClick = {
                            if (taskTitle.isBlank()) {
                                errorMessage = "Por favor, escribe una actividad válida."
                                return@Button
                            }
                            val newTask = Task(
                                id = System.currentTimeMillis().toString(),
                                title = taskTitle.trim(),
                                isCompleted = false,
                                dueDate = taskDueDate.ifBlank { LocalDate.now().toString() },
                                priority = taskPriority
                            )
                            tasks = listOf(newTask) + tasks
                            taskTitle = ""
                            errorMessage = ""
                        }
                    ) {
                        Text("Agregar")
                    }
                }
            }

            Divider()

            // Lista de actividades filtradas
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(filteredTasks, key = { it.id }) { task ->
                    TaskItem(
                        task = task,
                        onCheckedChange = { checked ->
                            tasks = tasks.map { 
                                if (it.id == task.id) it.copy(isCompleted = checked) else it 
                            }
                        },
                        onEdit = {
                            editingTask = task
                            editTitle = task.title
                            editDueDate = task.dueDate
                            editPriority = task.priority
                        },
                        onDelete = {
                            tasks = tasks.filter { it.id != task.id }
                        }
                    )
                }
            }
        }
    }

    // Diálogo de edición
    if (editingTask != null) {
        AlertDialog(
            onDismissRequest = { editingTask = null },
            title = { Text("Editar Actividad") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = editTitle,
                        onValueChange = { editTitle = it },
                        label = { Text("Título") },
                        singleLine = true
                    )
                    OutlinedTextField(
                        value = editDueDate,
                        onValueChange = { editDueDate = it },
                        label = { Text("Fecha (YYYY-MM-DD)") },
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        if (editTitle.isNotBlank()) {
                            tasks = tasks.map {
                                if (it.id == editingTask?.id) {
                                    it.copy(title = editTitle.trim(), dueDate = editDueDate)
                                } else it
                            }
                            editingTask = null
                        }
                    }
                ) {
                    Text("Guardar")
                }
            },
            dismissButton = {
                TextButton(onClick = { editingTask = null }) {
                    Text("Cancelar")
                }
            }
        )
    }
}`,

  taskModel: `package com.example.miagenda.model

enum class Priority { ALTA, MEDIA, BAJA }

data class Task(
    val id: String,
    val title: String,
    val isCompleted: Boolean,
    val dueDate: String,
    val priority: Priority
)`
};
