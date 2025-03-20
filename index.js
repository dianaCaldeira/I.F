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