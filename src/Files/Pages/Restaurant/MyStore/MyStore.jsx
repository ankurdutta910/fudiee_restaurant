import React, { useState, useEffect } from "react";
import { Button, Form, Image, Input, Label, TextArea } from "semantic-ui-react";
import { db, storage, auth } from "../../../../Firebase";
import { useParams, useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  updateDoc,
  doc,
  collection,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useUserAuth } from "../../../Pages/Auth/UserAuthContext";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  description: "",
  status: "",
};

function MyStore() {
  const { user } = useUserAuth();

  const [data, setData] = useState(initialState);
  const {
    img,
    restaurantName,
    description,
    openingTime,
    closingTime,
    offerAmount,
    offerPercentage,
    minOrderValue,
    status,
  } = data;
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
  // console.log(userData && userData.rest_id);

  useEffect(() => {
    id && getRestaurantData();
  }, [id]);

  const getRestaurantData = async () => {
    const docRef = doc(db, "restaurants", id);
    const snapshot = await getDoc(docRef, "restaurants");
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime + file.name;
      const storageRef = ref(storage, `restaurants/${id}`);

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
            <div className="active section">My Store</div>
          </div>

          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mt-3">
                <div className="card p-3 w-100">
                  <img
                    id="images"
                    className="img-fluid"
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                      border: "1px solid grey",
                    }}
                    src={img}
                    alt="Please wait..."
                  />
                  <label htmlFor="fileInput">
                    <Form.Input
                      label="Image upload (Dimensions: 1767*1920)"
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    ></Form.Input>
                  </label>

                  <label className="label mt-2">Status</label>
                  <Form.Field
                    control="select"
                    name="status"
                    onChange={handleChange}
                    value={status}
                  >
                    <option value="closed">Closed</option>
                    <option value="open">Open</option>
                  </Form.Field>
                </div>
              </div>
              <div className="col-md-8 mt-3">
                <div className="card p-3">
                  <label className="label">Restaurant Name</label>
                  <Input
                    name="restaurantName"
                    placeholder="Restaurant Name"
                    onChange={handleChange}
                    value={restaurantName}
                  />

                  <label className="label mt-2">Description</label>
                  <TextArea
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    value={description}
                  />

                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <label className="label">Opening Time</label>
                      <Input
                        type="time"
                        name="openingTime"
                        onChange={handleChange}
                        value={openingTime}
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <label className="label">Closing Time</label>
                      <Input
                        type="time"
                        name="closingTime"
                        onChange={handleChange}
                        value={closingTime}
                      />
                    </div>
                  </div>
                </div>

                <div className="card p-3 mt-2">
                  <h5>Offers & Discounts</h5>
                  <div className="row">
                    <div className="col-md-4 mt-2">
                      <label className="label">Offer Amount</label>
                      <Input
                        name="offerAmount"
                        placeholder="Offer Amount"
                        onChange={handleChange}
                        value={offerAmount}
                      />
                    </div>

                    <div className="col-md-4 mt-2">
                      <label className="label">Offer Percentage</label>
                      <Input
                        name="offerPercentage"
                        placeholder="Offer Percentage"
                        onChange={handleChange}
                        value={offerPercentage}
                      />
                    </div>

                    <div className="col-md-4 mt-2">
                      <label className="label">Min. Order Value</label>
                      <Input
                        name="minOrderValue"
                        placeholder="Minimum Order Value"
                        onChange={handleChange}
                        value={minOrderValue}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  color="primary"
                  className="my-3"
                  size="small"
                  type="submit"
                  disabled={progress !== null && progress < 100}
                >
                  Save Data
                  {/* {uploading ? "Submitting..." : "Save Data"} */}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default MyStore;
