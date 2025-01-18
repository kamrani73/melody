/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";

const validationSchema = Yup.object({
  first_name: Yup.string()
    .required("First Name is required")
    .min(3, "First Name must be at least 3 characters"),
  last_name: Yup.string()
    .required("Last Name is required")
    .min(3, "Last Name must be at least 3 characters"),
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 5 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters"),
});

const Register = () => {
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (values: any) => {
    const token = "aaa";

    try {
      const response = await axios.post(
        "http://192.168.100.24:9000/site/register",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResponseMessage("Registration successful!");
      console.log("Response:", response.data);
    } catch (error: any) {
      setResponseMessage(
        error.response?.data?.message || "Registration failed. Try again."
      );
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Register</h1>

        {/* Formik Form */}
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
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
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <Field
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your first name"
                />
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="text-red-500 text-xs mt-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <Field
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your last name"
                />
                <ErrorMessage
                  name="last_name"
                  component="div"
                  className="text-red-500 text-xs mt-2"
                />
              </div>
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

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-md"
              >
                Register
              </button>
            </Form>
          )}
        </Formik>

        {responseMessage && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
