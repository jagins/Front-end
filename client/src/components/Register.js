import React,{useState,useEffect} from 'react';
import '../App.css';
import {Button,Form,FormGroup,Label,Input} from 'reactstrap';  
import * as yup from "yup";
import axios from "axios";
import axiosWithAuth from './axiosWithAuth'

function Register({setPost}, props) {

    const [userInfo, setUserInfo]=useState({
        username:"",
        password:"",
        email:"",
        "21_or_over":false,
        reason_for_use:"",
        medical_condition:"",
        desired_effect:""
    })

    // server error
    const [serverError, setServerError] = useState("");

    // control whether or not the form can be submitted if there are errors in form validation (in the useEffect)
    const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

    // managing state for errors. empty unless inline validation (validateInput) updates key/value pair to have error
    const [errors, setErrors] = useState({
      username:"",
      password:"",
      email:"",
      "21_or_over":"",
      reason_for_use:"",
      medical_condition:"",
      desired_effect:""
    });


    const handleChange=(e)=>{
        e.persist();
        const newUserInfo = {
            ...userInfo,
            [e.target.name]:
            e.target.type === "checkbox" ? e.target.checked : e.target.value
          };
          console.log('After validate userInfo=',userInfo);
          validateChange(e); // for each change in input, do inline validation
          console.log('After validate err State=', errors)
          setUserInfo(newUserInfo); // update state with new data
    }

    
  //inline validation of one key-value pair at a time with yup
  const validateChange =(e)=>{
     yup.reach(formSchema, e.target.name)
     .validate(
       e.target.type === "checkbox" ? e.target.checked : e.target.value
     )
     .then((valid) => {
       // the input is passing!
       // the reset of that input's error
       console.log("valid here", e.target.name);
       setErrors({ ...errors, [e.target.name]: "" });
     })
     .catch((err) => {
       // the input is breaking form schema
       console.log("err here", err);
       setErrors({ ...errors, [e.target.name]: err.errors[0] });
     });
  }


    // whenever state updates, validate the entire form.
  // if valid, then change button to be enabled.
  useEffect(() => {
    formSchema.isValid(userInfo).then((valid) => {
      console.log("is my form valid?", valid);

      // valid is a boolean 
      setButtonIsDisabled(!valid);
    });
  }, [userInfo]);

    // Add a schema, used for all validation to determine whether the input is valid or not
  const formSchema = yup.object().shape({
    username: yup.string()
    .min(2,"Please enter name of atleast 2 characters")
    .required("oh please ! Name is required"),
    
    email: yup.string().email("Please enter a valid email"),  
    
    password: yup.string()
    .required("Please enter Password"),
    "21_or_over":yup.boolean(),
  
    reason_for_use: yup.string()
    .oneOf(["Medicinal","Recreational"])
    .required("Please choose one"),
    
    medical_condition: yup.string(),
    desired_effect:yup.string(),
  });


    const handleSubmit=(e)=>{
        e.preventDefault();
        callPost();        
      }
      
      function callPost(){
          axiosWithAuth()
          //to be replaced with MED CAB api from backend
          .post("/register", userInfo)
          .then((res)=>{
              //update the stored post - with response from api
              console.log('Response back from reqres:',res.data)
              // setPost(res.data)
              localStorage.setItem('token', res.data)
              props.history.push('/protectedStrains')
              //clear server error
              setServerError(null);
                 
          })
          .catch((err)=>{
            console.log('server erro in post',err)
            setServerError("oops! Looks like server side error!");
          })
      }
  

  return (
    <Form className="register-form"
         onSubmit={handleSubmit}
         name="register">
      {serverError && <p className="error">{serverError}</p>}
       <h2 className="text-center">Register!</h2>

       <FormGroup className="text-left">

        <Label htmlFor="userName">Name      
        <Input type="text"
        id="username"
        name="username"
        value={userInfo.username}
        onChange={handleChange}
        placeholder="Enter your Name"
        />
        {errors.username.length > 0 ? <p className="error">{errors.username}</p> : null}
        </Label> 
        </FormGroup>
        
        <FormGroup className="text-left">
        <Label htmlFor="email"> Email 
        <Input type="email"
        id="email"
        name="email"
        value={userInfo.email}
        onChange={handleChange}
        placeholder="Enter your email"
        />
        {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null}
        </Label>
        </FormGroup>

        <FormGroup className="text-left">
        <Label htmlFor="password"> Password
        <Input type="password"
        id="password"
        name="password"
        value={userInfo.password}
        onChange={handleChange}
        placeholder="Password"
        />
        {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
        </Label>
        </FormGroup>

        <FormGroup className="text-left pl-4">
        <Label htmlFor="21_or_over"> 
        <Input type="checkbox"
        id="21_or_over"
        name="21_or_over"
        checked={userInfo["21_or_over"]}
        onChange={handleChange}/>I declare that I'm 21+ Years Old
        {errors["21_or_over"].length > 0 ? <p className="error">{errors["21_or_over"]}</p> : null}
        </Label>
        </FormGroup>

        <FormGroup className="text-left">
        <Label htmlFor="reason_for_use"> Intent of Use?
            <select 
            id="reason_for_use"
            name="reason_for_use"
            value={userInfo.reason_for_use}
            onChange={handleChange}
            className="ml-4"
            >
            <option value="">***Please Choose One!***</option>
            <option value="Medicinal">Medicinal</option>  
            <option value="Recreational">Recreational</option>    
            </select>
            {errors.reason_for_use.length > 0 ? <p className="error">{errors.reason_for_use}</p> : null}
            </Label>
        </FormGroup>

        <FormGroup className="text-left">
        <Label htmlFor="desired_effect"> Desired Effect 
        <Input type="text"
        id="desired_effect"
        name="desired_effect"
        value={userInfo.desired_effect}
        onChange={handleChange}
        placeholder="Stress Relief / Suppress Pain / Induce Sleep"
        />
         {errors.desired_effect.length > 0 ? <p className="error">{errors.desired_effect}</p> : null}
         </Label>
        </FormGroup>

        <FormGroup className="text-left">
        <Label htmlFor="medical_condition">Medical Conditions if Any?
        <textarea
         id="medical_condition"
         name="medical_condition"
         value={userInfo.medical_condition}
         onChange={handleChange}
         className="mt-2 ml-4"
         placeholder="List down your Medical Conditions if any"
        /> 
         {errors.medical_condition.length > 0 ? <p className="error">{errors.medical_condition}</p> : null}
         </Label>
        </FormGroup>
      
       <Button className="btn-lg btn-dark btn-block"
       type="submit"
       disabled={buttonIsDisabled}
       >Register</Button>
    </Form>
  );
}

export default Register;
