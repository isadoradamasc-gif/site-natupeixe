document.addEventListener("DOMContentLoaded", function () {
    
    const numeroWhatsapp = "5533997027494";
    const alturaNavbar = document.querySelector('.navbar-natu').offsetHeight;

    
    const elementosAnimados = document.querySelectorAll('.animar-scroll');

    function checarScroll() {
        const gatilhoJanela = window.innerHeight * 0.85;
        elementosAnimados.forEach(elemento => {
            const elementoTop = elemento.getBoundingClientRect().top;

            if (elementoTop < gatilhoJanela) {
                elemento.classList.add('visivel');
            }
        });
    }

   
    checarScroll();
    window.addEventListener('scroll', checarScroll);


    
    let carrinho = [];
    const botoesAdd = document.querySelectorAll('.btn-add-item');
    const resumoContainer = document.getElementById('resumo-pedido');
    const listaCarrinhoContainer = document.getElementById('lista-carrinho');
    const totalPedidoTexto = document.getElementById('total-pedido');
    const btnFecharPedido = document.getElementById('btn-fechar-pedido');

    botoesAdd.forEach(botao => {
        botao.addEventListener('click', function () {
            const linhaProduto = this.closest('.item-produto');
            const nome = linhaProduto.getAttribute('data-nome');
            const preco = parseFloat(linhaProduto.getAttribute('data-preco'));
            const quantidadeInput = linhaProduto.querySelector('.qtd-produto');
            const quantidade = parseFloat(quantidadeInput.value);

            if (quantidade <= 0 || isNaN(quantidade)) return;

            // Verifica se o item já está no carrinho
            const itemExistente = carrinho.find(item => item.nome === nome);

            if (itemExistente) {
                itemExistente.quantidade += quantidade;
            } else {
                carrinho.push({ nome, preco, quantidade });
            }

            // Reseta o input visual para 1
            quantidadeInput.value = 1;

            atualizarInterfaceCarrinho();
        });
    });

    function atualizarInterfaceCarrinho() {
        if (carrinho.length === 0) {
            resumoContainer.classList.add('d-none');
            return;
        }

        resumoContainer.classList.remove('d-none');
        listaCarrinhoContainer.innerHTML = '';
        let totalGeral = 0;

        carrinho.forEach((item, index) => {
            const subtotal = item.preco * item.quantidade;
            totalGeral += subtotal;

            const li = document.createElement('li');
            li.className = "list-group-item d-flex justify-content-between align-items-center bg-transparent px-0";
            li.innerHTML = `
                <div>
                    <span class="fw-bold">${item.nome}</span> <br>
                    <small class="text-muted">${item.quantidade}kg x R$ ${item.preco.toFixed(2).replace('.', ',')}</small>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="fw-bold text-success">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                    <button class="btn btn-sm btn-outline-danger border-0 btn-remover" data-index="${index}"><i class="bi bi-trash"></i></button>
                </div>
            `;
            listaCarrinhoContainer.appendChild(li);
        });

        totalPedidoTexto.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;

   
        document.querySelectorAll('.btn-remover').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                carrinho.splice(index, 1);
                atualizarInterfaceCarrinho();
            });
        });
    }

    if (btnFecharPedido) {
        btnFecharPedido.addEventListener('click', function () {
            if (carrinho.length === 0) return;

            let textoMensagem = `*Novo Pedido - NatuPeixe* 🐟%0A%0A`;
            let totalGeral = 0;

            carrinho.forEach(item => {
                const subtotal = item.preco * item.quantidade;
                totalGeral += subtotal;
                textoMensagem += `• *${item.nome}*: ${item.quantidade}kg x R$ ${item.preco.toFixed(2).replace('.', ',')} = _R$ ${subtotal.toFixed(2).replace('.', ',')}_%0A`;
            });

            textoMensagem += `%0A*Total Estimado:* R$ ${totalGeral.toFixed(2).replace('.', ',')}%0A%0A_Gostaria de confirmar a disponibilidade e entrega!_`;

            const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${textoMensagem}`;
            window.open(urlWhatsapp, '_blank');
        });
    }


    
    const LinksMenu = document.querySelectorAll('.navbar-nav a, .btn-pedido');

    LinksMenu.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const targetPosition = targetSection.offsetTop - alturaNavbar;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    const navbarCollapse = document.getElementById('navbarNatu');
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (navbarCollapse && bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            }
        });
    });

    const secoes = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let atual = '';
        secoes.forEach(secao => {
            const secaoTop = secao.offsetTop - (alturaNavbar + 10);
            if (window.scrollY >= secaoTop) {
                atual = secao.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${atual}`) {
                link.classList.add('active');
            }
        });
    });

    // Envio do formulário de contato legado para o WhatsApp
    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', function (e) {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const mensagem = document.getElementById('mensagem').value;
            
            const textoMensagem = `*Novo contato via Site - NatuPeixe* 🐟%0A%0A` +
                                  `*Nome:* ${encodeURIComponent(nome)}%0A` +
                                  `*E-mail:* ${encodeURIComponent(email)}%0A` +
                                  `*Mensagem:* ${encodeURIComponent(mensagem)}`;
            
            const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${textoMensagem}`;
            window.open(urlWhatsapp, '_blank');
            formulario.reset();
        });
    }
});