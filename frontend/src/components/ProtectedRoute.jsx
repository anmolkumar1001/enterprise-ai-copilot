import { Navigate } from "react-router-dom";


// ProtectedRoute component acts as a wrapper/guard for protected pages
// 'children' prop represents the actual component/page we want to protect
function ProtectedRoute({children}) {

    const token = localStorage.getItem("token");

    if(!token) {

        // Redirect the user to the home/login page "/"
        // 'replace' prevents this redirect from being saved in browser history
        // so the user can't press the Back button to return to the protected page
        return <Navigate to="/" replace />;
    }

    // If token exists, user is authenticated and allowed to access the page
    // Render the child component that was wrapped inside <ProtectedRoute>
    return children;
}

export default ProtectedRoute;