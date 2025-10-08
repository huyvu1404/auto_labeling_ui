import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-2xl font-bold text-red-600">403 - Unauthorized</h1>
      <p className="mt-2 text-gray-600">
        You don’t have permission to access this page.
      </p>
      <Link
        to="/"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go back Home
      </Link>
    </div>
  );
}
