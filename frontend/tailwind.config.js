/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        custom: "#1E40AF", 
        "custom-dark": "#333333",
      },
    },
  },
  plugins: [],
};

