/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(4, "Username must be at least 5 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values: any) => {
    try {
      const response = await axios.post(
        "http://192.168.100.24:9000/site/login",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

     
      const token = response.data.result.access_token;
      localStorage.setItem("authToken", token);

     
      navigate("/home");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

        {/* Formik Form */}
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your username"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-xs mt-2"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-2"
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-md"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
