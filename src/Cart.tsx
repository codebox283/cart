// src/Cart.tsx
import React, { useEffect, useState } from 'react';

interface Product {
  title: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

const Cart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/products.json');
      const data: Product[] = await response.json();
      setProducts(data);
    };
    fetchData();
  }, []);

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.title === product.title);
    if (existingItem) {
      // Increase quantity if the product is already in the cart
      const updatedCartItems = cartItems.map(item =>
        item.title === product.title ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCartItems);
    } else {
      // Add new product to the cart
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = value;
    setCartItems(newCartItems);
  };

  const handleRemove = (index: number) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <h1>Product List</h1>
      <table style={{ border: '1px solid #ccc', width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.title}>
              <td>{product.title}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Shopping Cart</h2>
      <div style={{ border: '1px solid #000', padding: '10px', marginTop: '20px' }}>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total Price</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item.title}>
                    <td>{item.title}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                      />
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleRemove(index)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Total Amount: ${getTotalAmount().toFixed(2)}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
