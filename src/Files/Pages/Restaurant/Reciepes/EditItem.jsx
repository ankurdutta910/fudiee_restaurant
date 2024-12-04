import React, { useState, useEffect } from "react";
import { Button, Form, Image, Input, Label, TextArea } from "semantic-ui-react";
import { db, storage, auth } from "../../../../Firebase";
import { useParams, useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  getDocs,
  updateDoc,
  doc,
  collection,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useUserAuth } from "../../Auth/UserAuthContext";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  description: "",
  status: "",
};

function AddItem() {
  const { user } = useUserAuth();

  const [data, setData] = useState(initialState);
  const [items, setSubCollectionData] = useState([]);
  const {
    img,
    item_name,
    description,
    type,
    category,
    mrp,
    price,
    offer,
    availability,
    coupon,
  } = items;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);

  let userId = user && user.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDocRef = db.collection("users").doc(userId);
          const userDoc = await userDocRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserData(userData);
          } else {
            navigate("/");
          }
        } catch (error) {
          console.log("Error getting user document:", error);
        }
      } else {
        setTimeout(() => {
          navigate("/auth");
        }, 60000);
      }
    };
    fetchUserData();
  }, [userId]);

  let id = userData && userData.rest_id;

  useEffect(() => {
    id && getRestaurantData();
  }, [id]);

  const getRestaurantData = async () => {
    const docRef = doc(db, "restaurants", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };

  const getItems = async () => {
    const subColRef = collection(db, "restaurants", id, "items");
    const subSnapshot = await getDocs(subColRef);
    const subData = subSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSubCollectionData(subData);
  };

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime + file.name;
      const storageRef = ref(storage, `restaurants/${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;

            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // const validate = () => {
  //   let errors = {};
  //   if (!position) {
  //     errors.position = "Position is required";
  //   }
  //   return errors;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    if (!id) {
      try {
        await addDoc(collection(db, "restaurants"), {
          ...data,

          timestamp: serverTimestamp(),
        });
        toast.success("Data Updated Successfully!");
      } catch (error) {
        // console.log(error);
        toast.error(error);
      }
    } else {
      try {
        await updateDoc(doc(db, "restaurants", id), {
          ...data,

          timestamp: serverTimestamp(),
        });
        toast.success("Data Updated Successfully!");
      } catch (error) {
        toast.error(error);
        // console.log(error);
      }
    }

    // navigate(-1);
  };
  return (
    <>
      <div className="main-content">
        <div className="content">
          <div className="ui breadcrumb">
            <a className="section">Home</a>
            <i aria-hidden="true" className="right angle icon divider"></i>
            <a className="section">Menu</a>
            <i aria-hidden="true" className="right angle icon divider"></i>
            <div className="active section">Add Item</div>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-3 mt-3">
              <div className="card p-3 w-100">
                <img
                  id="images"
                  className="img-fluid"
                  style={{
                    width: "100%",
                    height: "190px",
                    objectFit: "cover",
                    border: "1px solid grey",
                  }}
                  src={img}
                  alt="Please wait..."
                />
                <label htmlFor="fileInput" className="mt-2">
                  <Form.Input
                    label="Image upload (Dimensions: 1767*1920)"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  ></Form.Input>
                </label>

                <label className="label mt-2">Availabilty</label>
                <Form.Field
                  control="select"
                  name="availability"
                  onChange={handleChange}
                  value={availability}
                >
                  <option value="">Select</option>
                  <option value="available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                </Form.Field>
              </div>
            </div>
            <div className="col-md-9 mt-3">
              <div className="card p-3">
                <label className="label">Item Name</label>
                <Input
                  name="item_name"
                  placeholder="Item Name"
                  onChange={handleChange}
                  value={item_name}
                />

                <label className="label mt-2">Description</label>
                <TextArea
                  name="description"
                  placeholder="Description"
                  onChange={handleChange}
                  value={description}
                />

                <div className="row">
                  <div className="col-md-3 mt-2">
                    <label className="label">Type</label>
                    <Form.Field
                      control="select"
                      name="type"
                      onChange={handleChange}
                      value={type}
                    >
                      <option value="">Select</option>
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                    </Form.Field>
                  </div>
                  <div className="col-md-3 mt-2">
                    <label className="label">Category</label>
                    <Form.Field
                      control="select"
                      name="category"
                      onChange={handleChange}
                      value={category}
                    >
                      <option value="">Select</option>
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                    </Form.Field>
                  </div>
                </div>
              </div>

              <div className="card p-3 mt-3">
                <div className="row">
                  <div className="col-md-3 mt-2">
                    <label className="label">MRP</label>
                    <Input
                      name="mrp"
                      placeholder="Original Price"
                      onChange={handleChange}
                      value={mrp}
                    />
                  </div>

                  <div className="col-md-3 mt-2">
                    <label className="label">Price</label>
                    <Input
                      name="price"
                      placeholder="Selling Price"
                      onChange={handleChange}
                      value={price}
                    />
                  </div>

                  <div className="col-md-3 mt-2">
                    <label className="label">Price</label>
                    <Input
                      name="offer"
                      placeholder="Extra Discount Amount"
                      onChange={handleChange}
                      value={offer}
                    />
                  </div>

                  <div className="col-md-3 mt-2">
                    <label className="label">Coupon COde</label>
                    <Input
                      name="coupon"
                      placeholder="Coupon Code"
                      onChange={handleChange}
                      value={coupon}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

export default AddItem;
