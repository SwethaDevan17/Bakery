from flask import Flask, render_template, request, jsonify, redirect
import json
import os

app = Flask(__name__)

ORDERS_FILE = 'orders.json'

# Load existing orders or return empty list
def load_orders():
    if os.path.exists(ORDERS_FILE):
        with open(ORDERS_FILE, 'r') as f:
            return json.load(f)
    return []

# Save updated orders to file
def save_orders(orders):
    with open(ORDERS_FILE, 'w') as f:
        json.dump(orders, f, indent=4)

# --- Routes ---

@app.route('/')
def order_page():
    return render_template('order.html')

@app.route('/payment')
def payment_page():
    return render_template('payment.html')

@app.route('/place_order', methods=['POST'])
def place_order():
    data = request.get_json()
    new_order = {
        "customer": data.get("customer"),
        "item": data.get("item"),
        "quantity": data.get("quantity")
    }

    orders = load_orders()
    orders.append(new_order)
    save_orders(orders)

    return jsonify({"message": f"Thanks {new_order['customer']}! Your order for {new_order['quantity']} × {new_order['item']} has been placed."})

@app.route('/get_orders')
def get_orders():
    return jsonify(load_orders())

@app.route('/make_payment', methods=['POST'])
def make_payment():
    data = request.get_json()
    name = data.get("name")
    amount = data.get("amount")
    return jsonify({"message": f"Payment of ₹{amount} received from {name}. Thank you!"})

@app.route("/thankyou")
def thankyou():
    name = request.args.get("name", "Guest")
    return render_template("thankyou.html", name=name)

@app.route("/submit")
def submit():
    return render_template("submit.html")


# --- Run Server ---
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

