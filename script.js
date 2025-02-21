class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const response = await fetch('products.json');
            const data = await response.json();
            this.renderProducts(data.products);
            this.init();
        } catch (error) {
            console.error('Error loading products:', error);
            document.getElementById('productsGrid').innerHTML = 
                '<p class="error">Error al cargar los productos. Por favor, intenta más tarde.</p>';
        }
    }

    renderProducts(products) {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" 
                 data-id="${product.id}" 
                 data-name="${product.name}" 
                 data-price="${product.price}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price}</p>
                <button class="add-to-cart">🛒</button>
            </div>
        `).join('');
    }

    init() {
        // Add event listeners to all add-to-cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const product = {
                    id: card.dataset.id,
                    name: card.dataset.name,
                    price: parseFloat(card.dataset.price),
                    image: card.querySelector('img').src
                };
                this.addItem(product);
            });
        });
    }

    addItem(product) {
        this.items.push(product);
        this.updateCart();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.updateCart();
    }

    updateCart() {
        const cartItems = document.getElementById('cartItems');
        const totalElement = document.getElementById('total');
        
        // Clear current cart items
        cartItems.innerHTML = '';
        
        // Calculate new total
        this.total = this.items.reduce((sum, item) => sum + item.price, 0);
        
        // Update total display
        totalElement.textContent = this.total;
        
        // Add each item to cart
        this.items.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">$${item.price}</p>
                </div>
                <button class="remove-item" data-index="${index}">×</button>
            `;
            
            cartItems.appendChild(cartItem);
            
            // Add remove button listener
            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                this.removeItem(index);
            });
        });
    }
}

// Initialize shopping cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});