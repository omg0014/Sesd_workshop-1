const API_URL = '/api/products';
// const AUTH_TOKEN = 'Bearer secure-token'; // Unused in this demo but kept for ref

let products = [];

// Fetch Logic
async function fetchProducts() {
    const search = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const sortVal = document.getElementById('sortSelect').value;

    const [sortBy, sortOrder] = sortVal.split('-');

    const queryParams = new URLSearchParams({
        search,
        category,
        sortBy,
        sortOrder
    });

    try {
        const response = await fetch(`${API_URL}?${queryParams}`);
        const result = await response.json();

        if (result.status === 'success') {
            products = result.data;
            renderProducts();
        }
    } catch (error) {
        console.error(error);
        showToast('Error loading products', 'error');
    }
}

// Render Logic with Mouse Move Effect
function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    products.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 50}ms`; // Staggered fade in
        
        card.innerHTML = `
            <div class="card-header">
                <span class="card-category">${p.category}</span>
                <div class="card-price">$${p.price.toFixed(2)}</div>
            </div>
            <h3 class="card-title">${p.name}</h3>
            <p class="card-desc">${p.description}</p>
            <div class="card-actions">
                <button class="btn" style="flex:1; justify-content:center" onclick="editProduct('${p.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct('${p.id}')">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;

        // Add mouse move effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        grid.appendChild(card);
    });
}

// Form Handlers
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('productId').value;
    const data = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        price: parseFloat(document.getElementById('price').value),
        description: document.getElementById('description').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showToast(id ? 'Product updated successfully' : 'Product created successfully', 'success');
            closeModal();
            fetchProducts();
        } else {
            const err = await response.json();
            showToast(err.message || 'Error saving product', 'error');
        }
    } catch (error) {
        showToast('Failed to connect to server', 'error');
    }
});

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showToast('Product deleted', 'success');
            fetchProducts();
        }
    } catch (error) {
        showToast('Failed to delete product', 'error');
    }
}

// Modal management
function editProduct(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById('modalTitle').innerText = 'Edit Product';
    document.getElementById('productId').value = p.id;
    document.getElementById('name').value = p.name;
    document.getElementById('category').value = p.category;
    document.getElementById('price').value = p.price;
    document.getElementById('description').value = p.description;

    const modal = document.getElementById('productModal');
    modal.style.display = 'flex';
    // Small delay to allow display flex to apply before opacity transition
    requestAnimationFrame(() => modal.classList.add('active'));
}

function openModal() {
    document.getElementById('modalTitle').innerText = 'New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    
    const modal = document.getElementById('productModal');
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('active'));
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    // Wait for transition to finish before hiding
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.className = ''; // Reset classes
    toast.classList.add(type);
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initial Load
fetchProducts();
