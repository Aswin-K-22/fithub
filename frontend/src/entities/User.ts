// # Core business models



export interface User {
    name: string;
    email: string;
    membership?: string;
    status?: string;
    lastLogin?: string;
    avatar?: string;
  }
  
  export default User;