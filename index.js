document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    menuIcon.addEventListener('click', function () {
        menuIcon.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    function abrirModal() {
        document.getElementById("modalHospedagem").style.display = "block";
    }

    function fecharModal() {
        document.getElementById("modalHospedagem").style.display = "none";
    }

    window.abrirModal = abrirModal;
    window.fecharModal = fecharModal;

    function abrirModalDica(modalId, event) {
        if (event) {
            event.preventDefault();
        }
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
        }
    }

    function fecharModalDica(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    }

    window.abrirModalDica = abrirModalDica;
    window.fecharModalDica = fecharModalDica;

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

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        if (!nome) {
            alert('Por favor, preencha o campo Nome.');
            return;
        }

        const telefone = document.getElementById('telefone').value.trim();
        const numeroLimpo = telefone.replace(/\D/g, '');
        if (telefone && (numeroLimpo.length < 10 || numeroLimpo.length > 11)) {
            alert('Por favor, insira um telefone válido com DDD (10 ou 11 dígitos).');
            return;
        }

        const dia = document.getElementById('dia').value.trim();
        const mes = document.getElementById('mes').value.trim();
        const ano = document.getElementById('ano').value.trim();
        if (dia && mes && ano) {
            if (isNaN(dia) || dia < 1 || dia > 31 || isNaN(ano) || ano < 2023 || ano > 2030) {
                alert('Por favor, preencha corretamente a data de chegada.');
                return;
            }
            const dataChegada = `${dia}/${mes}/${ano}`;
            
            // Adicionar a data de chegada ao formulário
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

        // Se a validação passar, envie o formulário
        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
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
});