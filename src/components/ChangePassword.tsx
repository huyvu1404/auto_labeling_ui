import { useState } from "react";

function ChangePasswordModal({ isOpen, onClose, onSubmit }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleSubmit = () => {
        onSubmit({ currentPassword, newPassword, confirmPassword });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow w-[400px]">
            <h2 className="text-lg font-medium mb-4">Change Password</h2>
            <div className="flex flex-col gap-3">
            <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border p-2 rounded"
            />
            <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 rounded"
            />
            <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-2 rounded"
            />
            </div>
            <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Submit
            </button>
            </div>
        </div>
        </div>
    );
}

export default ChangePasswordModal;
