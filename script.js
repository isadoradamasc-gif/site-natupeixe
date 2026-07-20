document.addEventListener("DOMContentLoaded", function () {
    
    const numeroWhatsapp = "5533997027494";
    const alturaNavbar = document.querySelector('.navbar-natu').offsetHeight;

    // 1. ANIMAÇÃO DE SCROLL
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

    // 2. LÓGICA DO CARRINHO E FORMULÁRIO DE ENTREGA
    let carrinho = [];
    const resumoContainer = document.getElementById('resumo-pedido');
    const listaCarrinhoContainer = document.getElementById('lista-carrinho');
    const totalPedidoTexto = document.getElementById('total-pedido');
    const btnFecharPedido = document.getElementById('btn-fechar-pedido');
    
    // Campos do formulário
    const selectCidade = document.getElementById('cliente-cidade');
    const avisoPrazos = document.getElementById('aviso-prazos');
    const textoPrazo = document.getElementById('texto-prazo');

    // Monitora a seleção de cidade para exibir as regras de entrega na tela
    if (selectCidade) {
        selectCidade.addEventListener('change', function() {
            avisoPrazos.classList.remove('d-none');
            if (this.value === 'Caratinga') {
                textoPrazo.innerHTML = `<strong>Regra de Caratinga:</strong> Entregas realizadas de Terça, Quarta e Quinta-feira. Pedidos enviados até as 07:00 da manhã serão entregues no próximo dia útil de entrega.`;
            } else if (this.value === 'Inhapim') {
                textoPrazo.innerHTML = `<strong>Regra de Inhapim:</strong> Entregas realizadas apenas na Sexta-feira. O pedido deve ser fechado e enviado até Quinta-feira às 13:00.`;
            }
        });
    }

    // Escuta cliques nos botões dos Combos
    const botoesCombo = document.querySelectorAll('.btn-add-combo');
    botoesCombo.forEach(botao => {
        botao.addEventListener('click', function () {
            const nome = this.getAttribute('data-nome');
            const preco = parseFloat(this.getAttribute('data-preco'));

            const itemExistente = carrinho.find(item => item.nome === nome);
            if (itemExistente) {
                itemExistente.quantidade += 1;
            } else {
                carrinho.push({ nome, preco, quantidade: 1 });
            }
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
            li.className = "list-group-item d-flex justify-content-between align-items-center bg-transparent px-0 border-bottom py-2";
            li.innerHTML = `
                <div style="text-align: left; max-width: 70%;">
                    <span class="fw-bold text-dark">${item.nome}</span> <br>
                    <small class="text-muted">${item.quantidade}x Combo(s)</small>
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

    // Dispara a mensagem estruturada contendo os dados de entrega detalhados
    if (btnFecharPedido) {
        btnFecharPedido.addEventListener('click', function () {
            if (carrinho.length === 0) return;

            // Coleta dos novos dados obrigatórios e opcionais
            const nomeCliente = document.getElementById('cliente-nome').value.trim();
            const cidadeCliente = document.getElementById('cliente-cidade').value;
            const ruaCliente = document.getElementById('cliente-rua').value.trim();
            const numeroCliente = document.getElementById('cliente-numero').value.trim();
            const bairroCliente = document.getElementById('cliente-bairro').value.trim();
            const complementoCliente = document.getElementById('cliente-complemento').value.trim();

            // Validação de obrigatoriedade (Nome, Cidade, Rua, Número e Bairro)
            if (!nomeCliente || !cidadeCliente || !ruaCliente || !numeroCliente || !bairroCliente) {
                alert("Por favor, preencha todos os campos obrigatórios marcados com (*) antes de enviar seu pedido!");
                return;
            }

            let textoMensagem = `*Novo Pedido de Combos - NatuPeixe* 🐟%0A%0A`;
            
            // Dados de Identificação do Cliente
            textoMensagem += `👤 *Cliente:* ${encodeURIComponent(nomeCliente)}%0A`;
            textoMensagem += `📍 *Cidade:* ${encodeURIComponent(cidadeCliente)}%0A`;
            
            // Montagem do Endereço Estruturado na mensagem
            let enderecoFormatado = `Rua: ${ruaCliente}, Nº: ${numeroCliente} - Bairro: ${bairroCliente}`;
            if (complementoCliente) {
                enderecoFormatado += ` (${complementoCliente})`;
            }
            textoMensagem += `🏠 *Endereço:* ${encodeURIComponent(enderecoFormatado)}%0A%0A`;
            
            textoMensagem += `📦 *Produtos Escolhidos:*%0A`;
            let totalGeral = 0;

            carrinho.forEach(item => {
                const subtotal = item.preco * item.quantidade;
                totalGeral += subtotal;
                textoMensagem += `• _${item.quantidade}x_ *${item.nome}* (R$ ${subtotal.toFixed(2).replace('.', ',')})%0A`;
            });

            textoMensagem += `%0A💰 *Total do Pedido:* R$ ${totalGeral.toFixed(2).replace('.', ',')}%0A%0A`;
            textoMensagem += `_Estou ciente dos prazos de entrega informados para a minha cidade e gostaria de prosseguir!_`;

            const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${textoMensagem}`;
            window.open(urlWhatsapp, '_blank');
        });
    }

    // 3. ROLAGEM SUAVE DO MENU
    const LinksMenu = document.querySelectorAll('.navbar-nav a, .btn-pedido');

    LinksMenu.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const targetPosition = targetSection.offsetTop - alturaNavbar;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    const navbarCollapse = document.getElementById('navbarNatu');
                    if (navbarCollapse) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) bsCollapse.hide();
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

    // 4. FORMULÁRIO DE CONTATO (Institucional)
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