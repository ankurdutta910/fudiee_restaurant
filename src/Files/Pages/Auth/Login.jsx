import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { useUserAuth } from "./UserAuthContext";
import "./Style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [successmsg, setSuccessMsg] = useState("");
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await logIn(email, password);
      setSuccessMsg("Credentials verified. Redirecting...");

      setTimeout(() => {
        setSuccessMsg("");
        setLoading(false);

        navigate("/", { replace: true });
      }, 2000);
    } catch (err) {
      setError("Alert! You are not authorized");
      setLoading(false);
      setTimeout(() => {
        setError("");
        setLoading(false);
      }, 3000);
    }
  };

  return (
    <>
      {/* <GoToTop /> */}
      <section>
        <div className="container" id="loginbox">
          <div class="account-page">
            <div class="account-center">
              <div class="account-box">
                <div class="account-logo">
                  <h2 style={{ fontWeight: "bold" }}>Foodie</h2>
                  <hr style={{ color: "#0289e2" }}></hr>
                </div>

                <Form onSubmit={handleSubmit} class="form-signin">
                  {error && <Alert variant="danger">{error}</Alert>}
                  {successmsg && (
                    <Alert
                      variant="success"
                      style={{ fontSize: "12px", textAlign: "center" }}
                    >
                      {successmsg}
                    </Alert>
                  )}
                  <div class="form-group">
                    <label>Registered Email</label>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        class="form-control"
                        type="email"
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div class="form-group">
                    <label>Password</label>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control
                        class="form-control"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <Link to="/password_reset" style={{ fontSize: "12px" }}>
                    Forgot Password
                  </Link>
                  {/* <div class="form-group text-right">
                            <Link to="/signin">Forgot your password?</Link>
                        </div> */}
                  <div class="form-group text-center my-3">
                    {/* <Button
                      icon
                      labelPosition="left"
                      primary
                      type="Submit"
                      size="small"
                    >
                      <Icon name="sign-in" /> Login
                    </Button> */}

                    {loading === true ? (
                      <>
                        <Button primary disabled id="go">
                          Loading...
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          primary
                          icon
                          labelPosition="left"
                          id="go"
                          type="submit"
                        >
                          <Icon name="sign-in" /> Login
                        </Button>
                      </>
                    )}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
