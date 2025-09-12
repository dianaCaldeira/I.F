document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    // Alternar menu de navegação
    menuIcon.addEventListener('click', function () {
        menuIcon.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Mostrar modal
    function abrirModal() {
        document.getElementById("modalHospedagem").style.display = "block";
    }

    // Fechar modal
    function fecharModal() {
        document.getElementById("modalHospedagem").style.display = "none";
    }

    window.abrirModal = abrirModal;
    window.fecharModal = fecharModal;

    // Abrir modal com base no ID
    function abrirModalDica(modalId, event) {
        if (event) {
            event.preventDefault();
        }
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
        }
    }

    // Fechar modal com base no ID
    function fecharModalDica(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    }

    window.abrirModalDica = abrirModalDica;
    window.fecharModalDica = fecharModalDica;

    // Início da contagem regressiva
    function startCountdown() {
        const eventDate = new Date('2025-10-11T15:30:00-03:00').getTime();

        setInterval(() => {
            const currentDate = new Date().getTime();
            const distance = eventDate - currentDate;

            if (distance < 0) {
                document.getElementById('countdown').innerHTML = "O evento começou!";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerHTML = days;
            document.getElementById("hours").innerHTML = hours;
            document.getElementById("minutes").innerHTML = minutes;
            document.getElementById("seconds").innerHTML = seconds;
        }, 1000);
    }

    startCountdown();

    const form = document.querySelector('.rsvp-form');

    // Submissão do formulário
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Capturar o nome
        const nome = document.getElementById('nome').value.trim();
        if (!nome) {
            alert('Por favor, preencha o campo Nome.');
            return;
        }

        // Capturar o telefone e validar
        const telefone = document.getElementById('telefone').value.trim();
        const numeroLimpo = telefone.replace(/\D/g, '');
        if (telefone && (numeroLimpo.length < 10 || numeroLimpo.length > 11)) {
            alert('Por favor, insira um telefone válido com DDD (10 ou 11 dígitos)');
            return;
        }

        // Capturar a confirmação de presença
        const comparecimento = document.querySelector('input[name="confirmacao"]:checked');
        if (!comparecimento) {
            alert('Por favor, indique se irá comparecer.');
            return;
        }

        // Capturar e validar a data de chegada
        const dia = document.getElementById('dia').value.trim();
        const mes = document.getElementById('mes').value.trim();
        const ano = document.getElementById('ano').value.trim();
        if (dia && mes && ano) {
            if (isNaN(dia) || dia < 1 || dia > 31 || isNaN(ano) || ano < 2023 || ano > 2030) {
                alert('Por favor, preencha corretamente a data de chegada.');
                return;
            }

            // Formatar a data de chegada 
            const dataChegada = `${dia}/${mes}/${ano}`;
            let dataChegadaInput = document.getElementById('dataChegadaHidden');
            if (!dataChegadaInput) {
                dataChegadaInput = document.createElement('input');
                dataChegadaInput.type = 'hidden';
                dataChegadaInput.id = 'dataChegadaHidden';
                dataChegadaInput.name = 'chegada';
                form.appendChild(dataChegadaInput);
            }
            dataChegadaInput.value = dataChegada;
        } else if (dia || mes || ano) {
            alert('Por favor, preencha a data de chegada completa.');
            return;
        }

        // Criar o objeto FormData para envio
        const formData = new FormData(form);
        formData.append('confirmacao', comparecimento.value); // Adicionar confirmação de presença

        // Enviar formulário para o Google Sheets
        fetch(form.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Sem CORS devido ao comportamento do Google Apps Script
        })
        .then(response => {
            alert('Formulário enviado com sucesso! Obrigado pelo R.S.V.P.');
            form.reset();
        })
        .catch(error => {
            console.error('Erro ao enviar o formulário:', error);
            alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
        });
    });

    function tornarFechamentoClicavel() {
        const botoesFecha = document.querySelectorAll('.fechar');
        botoesFecha.forEach(function (botao) {
            botao.addEventListener('touchstart', function (e) {
                e.preventDefault();
                const modalId = this.closest('.dica-modal').id;
                fecharModalDica(modalId);
            });
        });
    }

    tornarFechamentoClicavel();
});

// Funções para Conta Empresarial
function copiarPix() {
    const pixKey = document.getElementById('pixKey').textContent;
    navigator.clipboard.writeText(pixKey).then(function() {
        alert('Chave PIX copiada para a área de transferência!');
    }).catch(function(err) {
        console.error('Erro ao copiar: ', err);
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = pixKey;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Chave PIX copiada!');
    });
}

function gerarQRCode() {
    const pixKey = document.getElementById('pixKey').textContent;
    const valor = document.getElementById('valorSugerido').value || '100.00';
    const mensagem = document.getElementById('mensagemPix').value || 'Casamento Isadora e Felipe';
    
    // Simulação de geração de QR Code (em um caso real, você usaria uma API como a do Banco Central)
    const qrContainer = document.querySelector('.qr-placeholder');
    qrContainer.innerHTML = `
        <div class="qr-code-generated">
            <p>QR Code PIX Gerado</p>
            <div class="qr-mock">📱 QR CODE</div>
            <p class="qr-info">Valor: R$ ${valor}</p>
            <p class="qr-info">Chave: ${pixKey}</p>
            <button onclick="resetarQRCode()" class="botao-reset-qr">Gerar Novo</button>
        </div>
    `;
    
    alert('QR Code PIX gerado com sucesso!');
}

function resetarQRCode() {
    const qrContainer = document.querySelector('.qr-placeholder');
    qrContainer.innerHTML = `
        <p>QR Code PIX</p>
        <button onclick="gerarQRCode()" class="botao-gerar-qr">Gerar QR Code</button>
    `;
}

function toggleConfigEmpresarial() {
    const configDiv = document.getElementById('configEmpresarial');
    const botao = document.getElementById('botaoConfig');
    
    if (configDiv.style.display === 'none' || configDiv.style.display === '') {
        configDiv.style.display = 'block';
        botao.textContent = '🔼 Ocultar Configuração';
        botao.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        configDiv.style.display = 'none';
        botao.textContent = '⚙️ Configurar Conta Empresarial';
    }
}

function salvarConfiguracao() {
    const pixChave = document.getElementById('pixChave').value;
    const pixTitular = document.getElementById('pixTitular').value;
    const pixInstituicao = document.getElementById('pixInstituicao').value;
    const valorSugerido = document.getElementById('valorSugerido').value;
    const mensagemPix = document.getElementById('mensagemPix').value;
    
    if (!pixChave || !pixTitular) {
        alert('Por favor, preencha pelo menos a chave PIX e o nome do titular.');
        return;
    }
    
    // Salvar configurações no localStorage
    const config = {
        pixChave,
        pixTitular,
        pixInstituicao,
        valorSugerido,
        mensagemPix,
        dataUltimaAtualizacao: new Date().toISOString()
    };
    
    localStorage.setItem('configContaEmpresarial', JSON.stringify(config));
    
    // Atualizar a chave PIX exibida
    document.getElementById('pixKey').textContent = pixChave;
    
    alert('Configuração da conta empresarial salva com sucesso!');
    
    // Ocultar o formulário de configuração
    toggleConfigEmpresarial();
}

function resetarConfiguracao() {
    if (confirm('Tem certeza que deseja resetar todas as configurações?')) {
        localStorage.removeItem('configContaEmpresarial');
        
        // Resetar valores padrão
        document.getElementById('pixChave').value = 'isadora.felipe.casamento@gmail.com';
        document.getElementById('pixTitular').value = 'Isadora Silva Felipe Santos';
        document.getElementById('pixInstituicao').value = '';
        document.getElementById('valorSugerido').value = '';
        document.getElementById('mensagemPix').value = '';
        
        // Atualizar a chave PIX exibida
        document.getElementById('pixKey').textContent = 'isadora.felipe.casamento@gmail.com';
        
        alert('Configurações resetadas para os valores padrão.');
    }
}

function carregarConfiguracao() {
    const configSalva = localStorage.getItem('configContaEmpresarial');
    if (configSalva) {
        try {
            const config = JSON.parse(configSalva);
            
            document.getElementById('pixChave').value = config.pixChave || '';
            document.getElementById('pixTitular').value = config.pixTitular || '';
            document.getElementById('pixInstituicao').value = config.pixInstituicao || '';
            document.getElementById('valorSugerido').value = config.valorSugerido || '';
            document.getElementById('mensagemPix').value = config.mensagemPix || '';
            
            // Atualizar a chave PIX exibida
            if (config.pixChave) {
                document.getElementById('pixKey').textContent = config.pixChave;
            }
        } catch (error) {
            console.error('Erro ao carregar configuração:', error);
        }
    }
}

// Carregar configuração quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pequeno delay para garantir que todos os elementos estejam carregados
    setTimeout(carregarConfiguracao, 500);
});