const API_URL = '/api/products';
const AUTH_TOKEN = 'Bearer secure-token';

let products = [];

async function fetchProducts() {
    let search = document.getElementById('searchInput').value;
    let category = document.getElementById('categoryFilter').value;
    let sortVal = document.getElementById('sortSelect').value;

    let splitSort = sortVal.split('-');
    let sortBy = splitSort[0];
    let sortOrder = splitSort[1];

    let queryString = 'search=' + search + '&category=' + category + '&sortBy=' + sortBy + '&sortOrder=' + sortOrder;

    try {
        const response = await fetch(API_URL + '?' + queryString);
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

function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    for (let i = 0; i < products.length; i++) {
        let p = products[i];

        let html = `
            <div class="card">
                <span class="category">${p.category}</span>
                <h3>${p.name}</h3>
                <p class="desc">${p.description}</p>
                <div class="price">$${p.price.toFixed(2)}</div>
                <div class="card-actions">
                    <button class="btn" style="padding: 0.25rem 0.75rem;" onclick="editProduct('${p.id}')">Edit</button>
                    <button class="btn btn-danger" style="padding: 0.25rem 0.75rem;" onclick="deleteProduct('${p.id}')">Delete</button>
                </div>
            </div>
        `;

        grid.innerHTML += html;
    }
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    let id = document.getElementById('productId').value;
    let name = document.getElementById('name').value;
    let cat = document.getElementById('category').value;
    let price = document.getElementById('price').value;
    let desc = document.getElementById('description').value;

    let data = {
        name: name,
        category: cat,
        price: parseFloat(price),
        description: desc
    };

    let method = id ? 'PUT' : 'POST';
    let url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showToast(id ? 'Product updated' : 'Product added');
            closeModal();
            fetchProducts();
        } else {
            const err = await response.json();
            showToast(err.message, 'error');
        }
    } catch (error) {
        showToast('Failed to save product', 'error');
    }
});

async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;

    try {
        const response = await fetch(API_URL + '/' + id, {
            method: 'DELETE',
            headers: { 'Authorization': AUTH_TOKEN }
        });

        if (response.ok) {
            showToast('Product deleted');
            fetchProducts();
        }
    } catch (error) {
        showToast('Failed to delete product', 'error');
    }
}

function editProduct(id) {
    let p = products.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById('modalTitle').innerText = 'Edit Product';
    document.getElementById('productId').value = p.id;
    document.getElementById('name').value = p.name;
    document.getElementById('category').value = p.category;
    document.getElementById('price').value = p.price;
    document.getElementById('description').value = p.description;

    document.getElementById('productModal').style.display = 'flex';
}

function openModal() {
    document.getElementById('modalTitle').innerText = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function handleSearch() {
    fetchProducts();
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.style.background = type === 'success' ? '#1f2937' : '#dc2626';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(200%)';
    }, 2500);
}

fetchProducts();
