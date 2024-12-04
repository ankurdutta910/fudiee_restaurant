import React, { useState, useEffect } from "react";
import { Button, Checkbox } from "semantic-ui-react";
import { db } from "../../../../Firebase";
import { useNavigate } from "react-router-dom";
import {
  getDocs,
  doc,
  collection,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useUserAuth } from "../../Auth/UserAuthContext";

function Menu() {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [data, setData] = useState(null);
  const [items, setItems] = useState([]); // Updated state for items
  const [userData, setUserData] = useState(null);

  let userId = user && user.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDocRef = doc(db, "users", userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Error getting user document:", error);
        }
        // } else {
        //   setTimeout(() => {
        //     navigate("/auth");
        //   }, 60000);
      }
    };
    fetchUserData();
  }, [userId, navigate]);

  let id = userData && userData.rest_id;

  useEffect(() => {
    if (id) {
      getRestaurantData();
      getItems();
    }
  }, [id]);

  const getRestaurantData = async () => {
    try {
      const docRef = doc(db, "restaurants", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setData(snapshot.data());
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  const getItems = async () => {
    try {
      const subColRef = collection(db, "restaurants", id, "items");
      const subSnapshot = await getDocs(subColRef);
      const subData = subSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(subData); // Update state with fetched items
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAvailabilityChange = async (itemId, isAvailable) => {
    try {
      const itemRef = doc(db, "restaurants", id, "items", itemId);
      await updateDoc(itemRef, { availability: !isAvailable });
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, availability: !isAvailable } : item
        )
      );
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  return (
    <div className="main-content">
      <div className="content">
        <div className="ui breadcrumb">
          <a className="section">Home</a>
          <i aria-hidden="true" className="right angle icon divider"></i>
          <div className="active section">Menu</div>
        </div>
        <Button
          onClick={() => navigate("/add-item")}
          size="tiny"
          color="primary"
          style={{ float: "right" }}
        >
          Add Item
        </Button>

        <div className="row my-3">
          <div className="col-md-6">
            {items.length > 0 ? (
              items.map((item) => (
                <div className="card mb-2 ps-2 pb-2" key={item.id}>
                  <div className="d-flex g-0 justify-content-start">
                    <div className="img-div">
                      <img
                        src={item.img || "placeholder-image-url"}
                        className="img-fluid rounded-start"
                        alt={item.item_name || "Item Image"}
                      />
                    </div>
                    <div className="content-div">
                      <div className="pt-2 pb-2 ps-1 pe-1">
                        <h5 className="card-title">{item.item_name}</h5>
                        <p className="card-text">
                          {item.description
                            ? item.description.length > 20
                              ? `${item.description.substring(0, 20)}...`
                              : item.description
                            : "No Description Available"}
                        </p>
                        <p className="card-text">
                          <small className="text-muted">
                            {`Price: $${item.price} | Offer: ${item.offer}`}
                          </small>
                        </p>
                      </div>
                    </div>

                    <div className="available-div">
                      <Checkbox
                        checked={!item.availability}
                        onChange={() =>
                          handleAvailabilityChange(item.id, item.availability)
                        }
                        className="checkbox"
                        label="Out of Stock"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No items available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
