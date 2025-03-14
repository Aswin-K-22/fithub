import { useState ,FormEvent} from "react";
import { login } from "../../adapters/authApi";
import { AxiosError } from "axios";

interface LoginForm {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
    const {name , value} = e.target;
    setFormData((prev) => ({...prev , [name] : value}))
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }
  const validateForm = ():boolean =>{
    const newErrors: Errors = {};
    if(!formData.email || ! /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)){
      newErrors.email = "Please enter a valid email address"
    }
    if(!formData.password || formData.password.length < 6){
      newErrors.password = "Password must be at least 6 characters long"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!validateForm()) return;

    try {
      const data = await login(formData.email, formData.password);
      console.log("Logged in!", data);
    } catch (err : unknown) {
      if (err instanceof AxiosError) {
        setErrors({ general: err.response?.data?.message || "Login failed" });
      } else {
        setErrors({ general: "An unexpected error occurred" });
      }
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;