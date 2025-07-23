// --- Price List in ₹ ---
const productPrices = {
    "chocolate croissants": 60,
    "birthday cake": 500,
    "cookies": 30,
    "fruit tart": 120,
    "cupcake": 40
};

// --- Shared Elements ---
const itemSelect = document.querySelector('#itemSelect');
const quantityInput = document.querySelector('input[name="quantity"]');
const orderTotalDisplay = document.getElementById('orderTotal');
const amountInput = document.querySelector('input[name="amount"]');

// --- Update Total Amount when item or quantity changes ---
function updateTotalAmount() {
    if (itemSelect && quantityInput && orderTotalDisplay) {
        const item = itemSelect.value.toLowerCase();
        const qty = parseInt(quantityInput.value) || 0;
        const price = productPrices[item] || 0;
        const total = price * qty;

        orderTotalDisplay.innerText = total;
        // Also fill amount on payment page if same input is used
        if (amountInput) amountInput.value = total;
    }
}

if (itemSelect) itemSelect.addEventListener('change', updateTotalAmount);
if (quantityInput) quantityInput.addEventListener('input', updateTotalAmount);

// --- Handle Place Order Form ---
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = e.target;
        const data = {
            customer: form.customer.value,
            item: itemSelect.value,
            quantity: quantityInput.value
        };

        const response = await fetch('/place_order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById('orderResponse').innerText = result.message;

        // Don't reset total amount
        form.customer.value = '';
        itemSelect.value = '';
        quantityInput.value = '';
        updateTotalAmount();
    });
}

// --- Load Orders and Calculate Final Amount ---
async function loadOrders() {
    const res = await fetch('/get_orders');
    const orders = await res.json();

    const orderList = document.getElementById('orderList');
    let total = 0;

    if (orderList) {
        orderList.innerHTML = '';
        orders.forEach(order => {
            const item = order.item.toLowerCase();
            const qty = parseInt(order.quantity);
            const cost = productPrices[item] || 0;
            total += qty * cost;

            const li = document.createElement('li');
            li.innerText = `${order.customer} ordered ${qty} × ${order.item} (₹${cost * qty})`;
            orderList.appendChild(li);
        });
    }

    // Fill amount input in payment form
    if (amountInput) amountInput.value = total;
}

loadOrders();

// --- Handle Payment Form ---
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = e.target;
        const data = {
            name: form.name.value,
            amount: form.amount.value
        };

        const response = await fetch('/make_payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById('paymentResponse').innerText = result.message;
        form.reset();
    });
}
