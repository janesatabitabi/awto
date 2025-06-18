import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const StaffInventory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(list);
    });

    return () => unsub();
  }, []);

  return (
    <StaffLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Product Inventory</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className="py-2 px-4">Product Name</th>
                <th className="py-2 px-4">Brand</th>
                <th className="py-2 px-4">Size</th>
                <th className="py-2 px-4">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id} className="border-t">
                  <td className="py-2 px-4">{prod.name}</td>
                  <td className="py-2 px-4">{prod.brand}</td>
                  <td className="py-2 px-4">{prod.size}</td>
                  <td className="py-2 px-4">{prod.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffInventory;
