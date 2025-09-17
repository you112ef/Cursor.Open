const chatEl = document.getElementById('chat');
const msgEl = document.getElementById('message');
const sendBtn = document.getElementById('send');
const sessionEl = document.getElementById('sessionId');
const apiKeyEl = document.getElementById('apiKey');
const streamEl = document.getElementById('useStream');

function addMsg(role, content){
  const div = document.createElement('div');
  div.className = 'msg';
  div.innerHTML = `<span class="role">${role}:</span> <span class="content"></span>`;
  div.querySelector('.content').textContent = content;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

async function send(){
  const text = msgEl.value.trim();
  if(!text) return;
  addMsg('You', text);
  msgEl.value = '';
  const sessionId = sessionEl.value || 'web';
  const apiKey = apiKeyEl.value.trim();

  if(streamEl.checked){
    const ctrl = new AbortController();
    try{
      const resp = await fetch('/chat/stream', {
        method: 'POST',
        headers: Object.assign({'Content-Type': 'application/json'}, apiKey ? {'X-API-Key': apiKey} : {}),
        body: JSON.stringify({session_id: sessionId, message: text}),
        signal: ctrl.signal,
      });
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      const assistantDiv = document.createElement('div');
      assistantDiv.className = 'msg';
      assistantDiv.innerHTML = `<span class="role">Assistant:</span> <span class="content"></span>`;
      const contentSpan = assistantDiv.querySelector('.content');
      chatEl.appendChild(assistantDiv);
      while(true){
        const {value, done} = await reader.read();
        if(done) break;
        acc += decoder.decode(value, {stream:true});
        const chunks = acc.split('\n\n');
        acc = chunks.pop();
        for(const chunk of chunks){
          if(chunk.startsWith('data: ')){
            const payload = chunk.slice(6).trim();
            if(payload === '[DONE]') break;
            contentSpan.textContent += payload;
            chatEl.scrollTop = chatEl.scrollHeight;
          }
        }
      }
    }catch(e){
      addMsg('Assistant', `[error] ${e}`);
    }
  }else{
    try{
      const resp = await fetch('/chat', {
        method: 'POST',
        headers: Object.assign({'Content-Type': 'application/json'}, apiKey ? {'X-API-Key': apiKey} : {}),
        body: JSON.stringify({session_id: sessionId, message: text}),
      });
      const data = await resp.json();
      addMsg('Assistant', data.content || '');
    }catch(e){
      addMsg('Assistant', `[error] ${e}`);
    }
  }
}

sendBtn.addEventListener('click', send);
msgEl.addEventListener('keydown', (e)=>{ if(e.key==='Enter') send(); });