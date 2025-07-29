import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // 1. Sign in using Firebase popup
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // 2. Send Firebase ID token to backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await firebaseUser.getIdToken()}`,
        },
        body: JSON.stringify({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      // 3. Save user data to localStorage (or sessionStorage)
      localStorage.setItem("user", JSON.stringify(data));

      // 4. Redirect
      navigate("/");
    } catch (error) {
      console.error("Google Sign-in failed:", error.message);
      alert("Google Sign-in failed. Please try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition duration-300"
    >
      <FcGoogle className="text-2xl mr-3" />
      Continue with Google
    </button>
  );
}
