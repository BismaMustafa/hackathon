import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import the Firestore database
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore"; // Import necessary Firestore functions
import { useCart } from '../cartContext'; // Import CartContext

function Product() {
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const { addToCart } = useCart(); // Access addToCart from CartContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (productName.trim() !== '') {
      try {
        if (isEditing) {
          await updateDoc(doc(db, "products", currentProductId), { name: productName });
          setIsEditing(false);
          setCurrentProductId(null);
        } else {
          await addDoc(collection(db, "products"), { name: productName });
        }
        setProductName(''); // Clear the input field
      } catch (error) {
        console.error("Error saving product: ", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const handleEdit = (product) => {
    setProductName(product.name);
    setIsEditing(true);
    setCurrentProductId(product.id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter product name"
          className="border border-gray-300 rounded-md px-2 py-1"
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white rounded-md px-4 py-1 hover:bg-blue-600">
          {isEditing ? 'Update Product' : 'Add Product'}
        </button>
      </form>
      <ul>
        {products.map(product => (
          <li key={product.id} className="flex justify-between items-center mb-2">
            <span>{product.name}</span>
            <div>
              <button 
                onClick={() => handleEdit(product)} 
                className="bg-yellow-500 text-white rounded-md px-3 py-1 hover:bg-yellow-600 transition duration-150 ease-in-out mr-2"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(product.id)} 
                className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-600 transition duration-150 ease-in-out mr-2"
              >
                Delete
              </button>
              <button 
                onClick={() => addToCart({ id: product.id, name: product.name })} 
                className="bg-green-500 text-white rounded-md px-3 py-1 hover:bg-green-600 transition duration-150 ease-in-out"
              >
                Add to Cart
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Product;
