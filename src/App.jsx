import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./redux/productsSlice";
import { logout } from "./redux/authSlice";
import { FaShoppingCart } from "react-icons/fa";
import "./App.css";
import Signup from "./Signup";
import Login from "./Login";

const priceRanges = [
  { label: "1 - 500", min: 1, max: 500 },
  { label: "501 - 1000", min: 501, max: 1000 },
  { label: "1001 - 2000", min: 1001, max: 2000 },
  { label: "2001+", min: 2001, max: Infinity }
];

const App = () => {
  const dispatch = useDispatch();

  const { items: products, loading } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const [showSignup, setShowSignup] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRanges, setSelectedRanges] = useState([]);

  const productsPerPage = 8;

  
  useEffect(() => {
    if (user) dispatch(fetchProducts());
  }, [dispatch, user]);

 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  if (!user && showSignup)
    return (
      <Signup
        onBack={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    );

  if (!user && showLogin)
    return (
      <Login
        onBack={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
    );

  if (loading) return <h2 className="loading">Loading products...</h2>;

 
  const handleRangeChange = (label) => {
    setCurrentPage(1);

    setSelectedRanges((prev) =>
      prev.includes(label)
        ? prev.filter((r) => r !== label)
        : [...prev, label]
    );
  };

  const matchesPrice = (product) => {
    if (selectedRanges.length === 0) return true;

    return selectedRanges.some((label) => {
      const range = priceRanges.find((r) => r.label === label);

      return (
        range &&
        product.price >= range.min &&
        product.price <= range.max
      );
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    return matchesSearch && matchesPrice(product);
  });


  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const currentProducts = filteredProducts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  
  return (
    <>
     
      <div className="search-row">
        <div className="search-box">
          <input
            className="searchTerm"
            type="text"
            placeholder="Search products brands and more..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M21 20l-5.2-5.2a7 7 0 1 0-1 1L20 21l1-1zM10 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
          </svg>
        </div>

        <button
          className="signup-btn"
          onClick={() => {
            dispatch(logout());
            setShowSignup(true);
            setShowLogin(false);
          }}
        >
          Logout
        </button>
      </div>

    
      <div className="layout">
        <div className="sidebar">
          <h3>Select Price Range</h3>

          {priceRanges.map((range) => (
            <label key={range.label} className="filter-option">
              <input
                type="checkbox"
                checked={selectedRanges.includes(range.label)}
                onChange={() => handleRangeChange(range.label)}
              />
              ₹ {range.label}
            </label>
          ))}

          <button className="clear" onClick={() => setSelectedRanges([])}>
            Clear Filters
          </button>
        </div>

        <div className="container">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div className="card" key={product.id}>
                <div className="card-top">
                  <span className="offer">
                    {Math.round(product.discountPercentage)}% OFF
                  </span>
                </div>

                <img
                  src={product.thumbnail}
                  alt={product.title}
                  loading="lazy"
                />

                <div className="content">
                  <h3>{product.title}</h3>
                  <p className="brand">{product.brand}</p>

                  <div className="price">
                    <span className="new-price">
                      ₹{product.price}
                    </span>
                  </div>
                </div>

                <div className="button">
                  <button className="btn">
                    <FaShoppingCart /> Add to cart
                  </button>

                  <button className="remove">
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No products found</p>
          )}
        </div>
      </div>

      
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default App;