// App.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import api from "./api/axios";
import { setAuthToken } from "./api/axios";

const App = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const verify = async () => {
			const token = localStorage.getItem("token");
				if (!token) {
				console.log("No token in localStorage, skipping verification");
				return;
			}

				// ensure axios default header is set for immediate requests
				setAuthToken(token);

			try {
				console.log("Verifying token prefix:", token.slice ? token.slice(0, 12) : token);
				await api.get("/auth/me");
			} catch (err) {
				console.log("Token validation failed, clearing token", err?.response?.data || err.message);
				localStorage.removeItem("token");
				navigate("/login");
			}
		};

		verify();
	}, [navigate]);

	return <AppRoutes />;
};

export default App;
