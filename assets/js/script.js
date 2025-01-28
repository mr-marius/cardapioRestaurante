//Atribuição dos ids para as variáveis
const dateSpan = document.querySelector('#date-span');
const RestaurantOpen = checkRestaurantOpen();
const menu = document.getElementById('menu');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const addressInput = document.getElementById('address-input');
const addressWarnInput = document.getElementById('address-warn-input');
const cartCloseButton = document.getElementById('cart-close-button');
const cartCheckoutButton = document.getElementById('cart-checkout-button');
const cartButton = document.getElementById('cart-button');
const cartCounter = document.getElementById('cart-counter');

let cart = [];

function checkRestaurantOpen(){
    const date = new Date();
    const hora = date.getHours();
    
    return hora >= 18 && hora < 23;
}



//Atuliza carrnho
function modalUpdate() {
    let total = 0;

    cartItems.innerHTML = '';

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-6", "flex-col");
        
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="text-red-400 remove-from-cart" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;

        total += item.price * item.quantity;

        cartItems.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
    
}

//Função para adicionar item adicionar ao carrinho
function addToCart(name, price){

    const hasItem = cart.find(item => item.name === name);

    if(hasItem) {
        hasItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    modalUpdate();
}

//Função para remoção dos itens
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            modalUpdate()
            return;
        }

        cart.splice(index, 1);
        modalUpdate();
    }
}

//Verificar se o restaurante está aberto
document.addEventListener("DOMContentLoaded", () => {
    const dateSpan = document.querySelector("#date-span");
    
    const RestaurantOpen = checkRestaurantOpen(); // Verifique o estado do restaurante

    if (RestaurantOpen) {
        dateSpan.classList.remove("bg-red-500"); // Remove cor vermelha
        dateSpan.classList.add("bg-green-600");  // Adiciona cor verde
    } else {
        dateSpan.classList.remove("bg-green-600");
        dateSpan.classList.add("bg-red-500");      
    }
});

//Abrir modal do carrinho
cartButton.addEventListener('click', () => {
    modalUpdate();                                       
    cartModal.style.display = 'flex';
    
});

//Fechar modal(clique fora do carrinho)
cartModal.addEventListener('click', (event) => {
    if(event.target === cartModal){
        cartModal.style.display = 'none';
    }
});

//Fechar modal(botão fechar)
cartCloseButton.addEventListener('click', (event) => {
    cartModal.style.display = 'none';
});

//Evento de clique para adicionar items ao carrinho
menu.addEventListener('click', (event) => {
    //if(!RestaurantOpen){
        //alert("O RESTAURANTE ESTÁ FECHADO!");
        //return;
    //}
    
    let parentButton = event.target.closest('.add-to-cart-button');

    if(parentButton){
        const productName = parentButton.getAttribute("data-name");
        const productPrice = parseFloat(parentButton.getAttribute("data-price"));
        
        //Adicionar ao carrinho
        addToCart(productName, productPrice);
    }
})

//Localiza item a ser removido e chama a função para removê-lo
cartItems.addEventListener("click", (event) => {
    if(event.target.classList.contains("remove-from-cart")){
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
})

//Envio de input
addressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value;

    if(inputValue != ""){
        addressInput.classList.remove("border-red-500");
        addressWarnInput.classList.add("hidden");
    }
})

//Finalizar pedido
cartCheckoutButton.addEventListener("click", () => {
    //if(!RestaurantOpen){
        //Toastify({
            //text: "O RESTAURANTE ESTÁ FECHADO!",
            //duration: 3000,
            //close: true,
            //gravity: "top", // `top` or `bottom`
            //position: "right", // `left`, `center` or `right`
            //stopOnFocus: true, // Prevents dismissing of toast on hover
            //style: {
            //background: "#ef4444",
            //},
        //}).showToast();
        //return;
    //}
    if(cart.length === 0) return;

    if(addressInput.value === "") {
        addressWarnInput.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    //Enviar pedido pela api do whatsapp
    const cartItemsFinal = cart.map((item) => {
        return(
            `${item.name} 
            Quantidade: (${item.quantity}) 
            Preço: R$${item.price} |`
        );
    }).join("");

    const messege = encodeURIComponent(cartItemsFinal);
    const phone = "+5584996404492";

    window.open(`https://wa.me/${phone}?text=${messege} Endereço: ${addressInput.value}`, "_blank");

    cart = [];
    modalUpdate();
})




