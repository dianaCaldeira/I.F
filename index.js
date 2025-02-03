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
        const nome = document.getElementById('nome').value.trim();
        if (!nome) {
            alert('Por favor, preencha o campo Nome.');
            event.preventDefault();
            return;
        }

        const telefone = document.getElementById('telefone').value.trim();
        if (telefone && !/^$$\d{2}$$ \d{4,5}-\d{4}$/.test(telefone)) {
            alert('Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX.');
            event.preventDefault();
            return;
        }

        const dia = document.getElementById('dia').value.trim();
        const mes = document.getElementById('mes').value.trim();
        if (dia && (!mes || isNaN(dia) || dia < 1 || dia > 31)) {
            alert('Por favor, preencha corretamente o dia e o mês de chegada.');
            event.preventDefault();
            return;
        }

        alert('Formulário enviado com sucesso! Obrigado pelo R.S.V.P.');
    });
});