import "./App.css";
import { useState, useEffect } from "react";
const apiUrl = process.env.REACT_APP_API_URL;

function App() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    desc: "",
  });

  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getProduct = () => {
    fetch(`${apiUrl}/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
      const data = await response.json();
      console.log("Product added:", data);
      getProduct(); 
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/delete-product/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      console.log("Product deleted");
      getProduct(); 
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="container">
      <div className="mt-2">
        <h4 className="my-3">Add Product</h4>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="input-field">
            <input
              type="number"
              placeholder="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="input-field">
            <textarea
              placeholder="Description...."
              name="desc"
              value={formData.desc}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 my-2">
            Add
          </button>
        </form>
      </div>

      {products.length ? (
        <table className="table mt-4">
          <thead>
            <tr className="table-dark">
              <th scope="col">SR No</th>
              <th scope="col">Title</th>
              <th scope="col">Price</th>
              <th scope="col">Desc</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>{product.desc}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div
          style={{
            height: "30vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h4>No products available</h4>
        </div>
      )}
    </div>
  );
}

export default App;
