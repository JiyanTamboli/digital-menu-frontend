import axios from "axios"; // Import axios for API calls
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table, Navbar, Nav, Container } from "react-bootstrap";
import "./Admin.css"; // Custom styles for admin page
import './AdminSearchFilter.css'; // Styles for search/filter UI
import { useNavigate } from "react-router-dom";

// Main Admin component for menu management and admin actions
export default function Admin() {
  const [showAdd, setShowAdd] = useState(false); // State for Add Modal show/hide
  const [showUpdate, setShowUpdate] = useState(false); // State for Update Modal show/hide
  const navigate = useNavigate(); // Navigation hook for route changes

  // Handles the admin logout and redirects to user/homepage
  const handleLogout = () => {
    navigate("/"); // Navigates to home/user page
  };
  
  const [sts, setSts] = useState(''); // Tracks admin/status response from API
  const [data, setData] = useState([]); // Stores menu data retrieved from API

  // States for add menu form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [spicy, setSpicy] = useState("");
  const [availability, setAvailability] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  // States for update menu form fields
  const [updateId, setUpdateId] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateSpicy, setUpdateSpicy] = useState("");
  const [updateAvailability, setUpdateAvailability] = useState("");
  const [updateCategory, setUpdateCategory] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");

  const [type, setType] = useState("all"); // Filter type for menu items
  const [searchText, setSearchText] = useState(""); // Search filter text input

  // Fetches menu data from backend API on initial load and after actions
  const api = () => {
    axios.get("https://digital-menu-backend-2gsm.onrender.com/user")
      .then((res) => {
        setSts(res.data.status);
        setData(res.data.menu);
      });
  };

  // Checks if menu item category is veg
  const isVeg = (category) => {
    const cat = category.toLowerCase();
    return cat.includes("veg") && !cat.includes("non");
  };

  // Checks if menu item category is non-veg
  const isNonVeg = (category) => {
    const cat = category.toLowerCase();
    return cat.includes("non");
  };

  // Filters menu data based on category and search input
  const filteredData = data.filter(item => {
    const matchesType = (type === "all") ||
      (type === "veg" && isVeg(item.category)) ||
      (type === "nonveg" && isNonVeg(item.category));

    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase());

    return matchesType && matchesSearch;
  });

  // Modal show/hide handlers for add and update dialogs
  const handleAddClose = () => setShowAdd(false);
  const handleAddShow = () => setShowAdd(true);
  const handleUpdateClose = () => setShowUpdate(false);

  // Prepare update form with selected menu item values and open modal
  const handleUpdateShow = (item) => {
    setUpdateId(item.item_id);
    setUpdateName(item.name);
    setUpdateDescription(item.description);
    setUpdateSpicy(item.spicy_level);
    setUpdateAvailability(item.availability_status);
    setUpdateCategory(item.category);
    setUpdatePrice(item.price);
    setShowUpdate(true);
  };

  // Save new menu item to database via API
  const saveChanges = () => {
    const dt = {
      name,
      description,
      spicy_level: spicy,
      availability_status: availability,
      category,
      price,
    };
    console.log(dt);
    axios.post("https://digital-menu-backend-2gsm.onrender.com/addMenu", dt)
      .then(res => {
        console.log("Response from addMenu:", res.data); // API response debug
        if (res.data.status == 200 || res.data.status == '200' || res.data.status === 'Success') {
          alert("Insert Success");
          api();
          handleAddClose();
          clearAddForm();
        } else {
          alert("Insert Failed");
        }
      })
      .catch(() => alert("Insert Failed due to server error"));
  };

  // Reset add menu form fields to empty values
  const clearAddForm = () => {
    setName(""); setDescription(""); setSpicy(""); setAvailability(""); setCategory(""); setPrice("");
  };

  // Update existing menu item in database via API  
  const updateChanges = () => {
    const updatedData = {
      name: updateName,
      description: updateDescription,
      spicy_level: updateSpicy,
      availability_status: updateAvailability,
      category: updateCategory,
      price: updatePrice,
    };
    axios.put(`https://digital-menu-backend-2gsm.onrender.com/user/${updateId}`, updatedData)
      .then(res => {
        if (res.data.status === 'Success') {
          alert("Update Success");
          api();
          handleUpdateClose();
        } else {
          alert("Update Failed");
        }
      })
      .catch(() => alert("Error during update"));
  };

  // Delete menu item by ID via API
  const del = (uid) => {
    axios.delete(`https://digital-menu-backend-2gsm.onrender.com/user/${uid}`)
      .then(res => {
        if (res.data.status === 'Deleted') {
          alert("Delete Success");
          api();
        } else {
          alert("Delete Failed");
        }
      })
      .catch(() => alert("Delete request failed"));
  };

  // Runs API data fetch on initial component mount
  useEffect(() => {
    api();
  }, []);

  return (
    <>
      <div className="admin-background p-4">
        <center>
          {/* Input box for searching menu items by name or description */}
          <div className="search-bar-container">
            <input
              type="search"
              placeholder="Search by name or description..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>
          {/* Menu category filter buttons for all/veg/nonveg */}
          <div className="filter-buttons">
            <button
              className={type === "all" ? "filter-btn active" : "filter-btn"}
              onClick={() => setType("all")}
            >All</button>
            <button
              className={type === "veg" ? "filter-btn active" : "filter-btn"}
              onClick={() => setType("veg")}
            >Veg</button>
            <button
              className={type === "nonveg" ? "filter-btn active" : "filter-btn"}
              onClick={() => setType("nonveg")}
            >Non-Veg</button>
          </div>

          {/* Open add menu modal on button click */}
          <Button className="mb-4 add-btn" onClick={handleAddShow}>
            ➕ Add New Menu Item
          </Button>
          {/* Displays the admin page status from API */}
          <h2 className="status-text">Admin Page Status: {sts}</h2>

          {/* Table for showing menu data, with Delete and Update actions */}
          <Table striped bordered hover responsive className="custom-table mt-3">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Description</th><th>Availability</th>
                <th>Category</th><th>Spicy Level</th><th>Price</th>
                <th>Delete</th><th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.item_id}>
                  <td>{item.item_id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.availability_status ? "Yes" : "No"}</td>
                  <td>{item.category}</td>
                  <td>{item.spicy_level}</td>
                  <td>₹{item.price}</td>
                  {/* Delete button for removing menu item */}
                  <td><Button variant="danger" size="sm" onClick={() => del(item.item_id)}>Delete</Button></td>
                  {/* Update button opens update modal for selected menu item */}
                  <td><Button variant="warning" size="sm" onClick={() => handleUpdateShow(item)}>Update</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </div>

      {/* Add Menu Item modal for inserting new items */}
      <Modal show={showAdd} onHide={handleAddClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>✨ Add New Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form fields for new menu item inputs */}
          <Form.Group className="mb-3">
            <Form.Label>Dish Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Spicy Level</Form.Label>
            <Form.Control type="text" value={spicy} onChange={(e) => setSpicy(e.target.value)} placeholder="Enter Spicy Level" />
          </Form.Group>
          <Form.Group className="mb-3">
  <Form.Label>Availability Status</Form.Label>

  <Form.Select
  value={String(availability)}
  onChange={(e) => setAvailability(e.target.value === "true")}
>
    <option value="">Select Availability</option>
    <option value="true">Yes</option>
    <option value="false">No</option>
  </Form.Select>
</Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter Category" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter Price" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {/* Buttons to cancel or save menu item */}
          <Button variant="secondary" onClick={handleAddClose}>Cancel</Button>
          <Button variant="primary" onClick={saveChanges}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal for editing a menu item */}
      <Modal show={showUpdate} onHide={handleUpdateClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>✏️ Update Menu Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form fields for editing selected menu item */}
          <Form.Group className="mb-3">
            <Form.Label>Dish Name</Form.Label>
            <Form.Control type="text" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Spicy Level</Form.Label>
            <Form.Control type="text" value={updateSpicy} onChange={(e) => setUpdateSpicy(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
  <Form.Label>Availability Status</Form.Label>

  <Form.Select
  value={String(updateAvailability)}
  onChange={(e) => setUpdateAvailability(e.target.value === "true")}
>
  <option value="true">Yes</option>
  <option value="false">No</option>
</Form.Select>
</Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" value={updateCategory} onChange={(e) => setUpdateCategory(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control type="text" value={updatePrice} onChange={(e) => setUpdatePrice(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {/* Buttons to cancel or confirm update */}
          <Button variant="secondary" onClick={handleUpdateClose}>Cancel</Button>
          <Button variant="primary" onClick={updateChanges}>Update</Button>
        </Modal.Footer>
      </Modal>
      <center>
        {/* Logout button to exit admin panel */}
        <Button variant="outline-light" onClick={handleLogout} className="logout-btn">
          Log Out
        </Button>
      </center>
    </>
  );
}
