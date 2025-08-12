package com.openassistant.safe

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.net.HttpURLConnection
import java.net.URL


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { App() }
    }
}

data class ChatMsg(val role: String, val content: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun App() {
    var baseUrl by remember { mutableStateOf("http://10.0.2.2:8000") } // emulator loopback
    var apiKey by remember { mutableStateOf("") }
    var sessionId by remember { mutableStateOf("android") }
    var input by remember { mutableStateOf("") }
    val msgs = remember { mutableStateListOf<ChatMsg>() }
    val scope = rememberCoroutineScope()

    fun send() {
        val text = input.trim()
        if (text.isEmpty()) return
        input = ""
        msgs.add(ChatMsg("You", text))
        scope.launch(Dispatchers.IO) {
            val url = URL("$baseUrl/chat")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                if (apiKey.isNotEmpty()) setRequestProperty("X-API-Key", apiKey)
                doOutput = true
            }
            val body = "{" +
                    "\"session_id\":\"$sessionId\"," +
                    "\"message\":\"" + text.replace("\"", "\\\"") + "\"}"
            conn.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }
            val resp = conn.inputStream.readBytes().toString(Charsets.UTF_8)
            val content = Regex("\"content\"\s*:\s*\"(.*)\"", RegexOption.DOT_MATCHES_ALL)
                .find(resp)?.groupValues?.get(1)?.replace("\\n", "\n")?.replace("\\\"", "\"") ?: ""
            scope.launch(Dispatchers.Main) {
                msgs.add(ChatMsg("Assistant", content))
            }
        }
    }

    MaterialTheme {
        Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            OutlinedTextField(value = baseUrl, onValueChange = { baseUrl = it }, label = { Text("Base URL") })
            OutlinedTextField(value = apiKey, onValueChange = { apiKey = it }, label = { Text("API Key") })
            OutlinedTextField(value = sessionId, onValueChange = { sessionId = it }, label = { Text("Session ID") })
            LazyColumn(modifier = Modifier.weight(1f)) {
                items(msgs) { m ->
                    Text("${m.role}: ${m.content}")
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(modifier = Modifier.weight(1f), value = input, onValueChange = { input = it }, label = { Text("Message") })
                Button(onClick = { send() }) { Text("Send") }
            }
        }
    }
}