import React, { useState, useEffect } from 'react';
import socketIo from 'socket.io-client';

const ENDPOINT = 'http://localhost:8000';
let socket;

const App = () => {
  const [message, setMessage] = useState('');
  const [product, setProduct] = useState([]);

  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ['websocket'] });

    socket.on('products', (data) => {
      console.log(`products: ${JSON.stringify(data.products)}`);
      setProduct(data.products);
    });

    socket.on('chatMessage', async () => {
      try {
        const response = await fetchProducts();
        setProduct(response.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  const handleSubmit = () => {
    socket.emit('chatMessage', { message: message, id: socket.id });
    setMessage('');
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/products');
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error fetching products:', error);
    }
  };

 const deleteProduct=async(id)=>{
  socket.emit('deleteProduct', { product_id: id, id: socket.id });
 }

  return (
    <>
      <div style={{ margin: 16 }}>
        <p>My Chat App</p>
        <hr />
        <input
          type="text"
          value={message}
          placeholder="Enter your message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <br />
        <button onClick={handleSubmit}>Submit</button>
        <hr />
        <br />
        <div>
          {product.map((item) => (
            <div key={item._id}>{item.title} &nbsp;&nbsp;&nbsp; 
            <span onClick={()=>deleteProduct(item._id)} style={{color:'red',cursor:'pointer'}}>X</span></div>
            
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
