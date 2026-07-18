import axios from "axios"; // Import axios for HTTP requests
import Row from 'react-bootstrap/Row'; // Bootstrap grid row for layout
import Col from 'react-bootstrap/Col'; // Bootstrap grid column for cards
import Card from 'react-bootstrap/Card'; // Bootstrap card component for menu display
import Container from 'react-bootstrap/Container'; // Bootstrap container for consistent spacing
import { useState, useEffect } from "react";
import "./User.css"; // Custom CSS for user page
import './SearchAndFilter.css'; // Style for search/filter layout
import Veg from "../assets/Veg.jpg"; // Veg filter image
import NonVeg from "../assets/NonVeg.jpg"; // Non-veg filter image

// Main User component to display menu and search/filter options
export default function User() {
  const [sts, setSts] = useState(''); // Menu load status from API
  const [data, setData] = useState([]); // Menu data fetched from server
  const [type, setType] = useState("all"); // Filter type for vegetarian/non-vegetarian/all
  const [searchText, setSearchText] = useState(""); // Search bar text input

  // Fetch menu data from API when component mounts
  useEffect(() => {
    axios.get("https://digital-menu-backend-2gsm.onrender.com/user")
      .then((res) => {
        setSts(res.data.status);
        setData(res.data.menu); // Save menu data to state
      });
  }, []);

  // Helper function to check if dish is vegetarian
  const isVeg = (category) => {
    const cat = category.toLowerCase();
    return cat.includes("veg") && !cat.includes("non");
  };

  // Helper function to check if dish is non-vegetarian
  const isNonVeg = (category) => {
    const cat = category.toLowerCase();
    return cat.includes("non");
  };

  // Filter data by veg/nonveg/all and by search keyword
  const filteredData = data.filter(item => {
    const matchesType = (type === "all") ||
      (type === "veg" && isVeg(item.category)) ||
      (type === "nonveg" && isNonVeg(item.category));

    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="page-background">
      {/* Navigation bar at top (code can be added here) */}
      <nav className="custom-navbar">
        {/* ...your navbar code... */}
      </nav>

      {/* Search bar to filter menu items by name or description */}
      <div className="search-bar-container">
        <input
          type="search"
          placeholder="Search by name or description..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <br></br><br></br><br></br><br></br><br></br>

      {/* Header text section for welcome message */}
      <center className="header-text">
        <br></br><br></br><br></br>
        <h1>Welcome to our Digital Menu!</h1>
        <br />
      </center>

      {/* Filter images to filter menu by veg or nonveg */}
      <div className="filter-images">
        <img
          src={Veg}
          alt="Veg"
          onClick={() => setType("veg")}
        />
        <img
          src={NonVeg}
          alt="Non-Veg"
          onClick={() => setType("nonveg")}
        />
      </div>

      {/* List of menu items rendered as cards */}
      <div className="cards-container">
        <Container className="mt-4">
          <Row>
            {filteredData.map(item => (
              <Col md={4} key={item.item_id} className="mb-4">
                <Card className="custom-card">
                  <Card.Body>
                    {/* Price badge for menu item */}
                    <div className="price-badge">₹{item.price}</div>
                    {/* Card title with menu item ID */}
                    <Card.Title>ID: {item.item_id}</Card.Title>
                    <Card.Text>
                      <strong>Name:</strong> {item.name}<br />
                      <strong>Description:</strong> {item.description}<br />
                      <strong>Category:</strong> {item.category}<br />
                      <strong>Spicy Level:</strong> {item.spicy_level}<br />
                      {/* Availability status styling true/false */}
                      <strong>Availability:</strong>
                      <span className={item.availability_status ? "availability-Yes" : "availability-No"}>
                        {String(item.availability_status)}
                      </span>
                      <br />
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
}
