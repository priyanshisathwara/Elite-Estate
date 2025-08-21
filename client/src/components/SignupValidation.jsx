import { Children } from "react";

function Validation(key = "", values) {
    console.log("kjhgf")
    let error = {};

    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,}$/;

    if (!values.role || (values.role !== "user" && values.role !== "owner")) {
        errors.role = "Please select a valid role";
    }
    

    if (!key || key == "" || key == "checkName") {
        if (!values.name || values.name.trim() === "") {
            error.name = "name should not be empty";
        }
    }

    if (!values?.email || values?.email?.trim() === "") {
        if (!key || key == "" || key == "checkEmail") {
            error.email = "Email should not be empty";
        }
    } else if (!email_pattern.test(values.email)) {
        if (!key || key == "" || key != "checkEmail") {
            error.email = "Invalid email format";
        }
    }

    if (!key || key == "" || key == "checkPassword") {
        if (!values.password || values.password.trim() === "") {
            error.password = "Password should not be empty";
        } else if (!password_pattern.test(values.password)) {
            error.password = "Password must contain at least 6 characters, including uppercase, lowercase, and number";
        }
    }
    console.log(error)

    return error;
}

export default Validation;
