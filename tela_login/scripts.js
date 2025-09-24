//modal do termos de uso

// seleciona os elementos do HTML que vai ser usado
const linkTermos = document.getElementById('abrir-modal-termos');
const modal = document.getElementById('modal-termos');
const btnFechar = document.querySelector('.modal-fechar');

// Função para abrir o modal
function abrirModal(event) {
    event.preventDefault(); // Impede que o link '#' recarregue a página
    modal.style.display = 'flex'; // Torna o modal visível
}

// Função para fechar o modal
function fecharModal() {
    modal.style.display = 'none'; // Esconde o modal
}

// Adiciona os "escutadores" de eventos
linkTermos.addEventListener('click', abrirModal); // Abre ao clicar no link
btnFechar.addEventListener('click', fecharModal); // Fecha ao clicar no 'X'

// Fecha o modal se o usuário clicar fora da caixa de conteúdo (no fundo escuro)
modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        fecharModal();
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


