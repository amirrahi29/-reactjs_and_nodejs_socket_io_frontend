import React, { useState, useEffect } from 'react';
import socketIo from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
let socket;

const App = () => {
  const [message, setMessage] = useState('');
  const [product, setProduct] = useState([]);

  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ['websocket'] });

    // socket.on('chatMessage', (data) => {
    //   setProduct(data.product);
    // });

    socket.on('products', (data) => {
      setProduct(data.product);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  const handleSubmit = () => {
    socket.emit('chatMessage', { message: message, id: socket.id });
    console.log(`product: ${JSON.stringify(product)}`);
  };

  return (
    <>
      <div style={{ margin: 16 }}>
        <p>My Chat App</p>
        <hr />
        <input type="text" value={message} placeholder='Enter your message' onChange={(e) => setMessage(e.target.value)} /><br /><br />
        <button onClick={handleSubmit}>Submit</button>
        <hr />
        <br />
        <div>
          {product.map((item) => (
            <div key={item.id}>{item.title}</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
