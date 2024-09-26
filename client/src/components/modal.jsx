import React from "react";

function Modal({ currentEditor, onClose, onSave }) {
  const updateEditorData = async (updatedEditor) => {
    try {
      const response = await fetch(
        `http://localhost:4000/editorProfile/${updatedEditor.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEditor),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update editor data");
      }

      const data = await response.json();
      console.log("Editor updated successfully:", data);
      onSave(updatedEditor); // Notify parent about the updated editor data
    } catch (error) {
      console.error("Error updating editor:", error);
      // Optionally notify user of the error here
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const updatedEditor = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      location: e.target.location.value,
      software: e.target.software.value.split(", "),
      specializations: e.target.specializations.value.split(", "),
    };

    await updateEditorData(updatedEditor); // Call the function to update editor data
    onClose(); // Close the modal after submission
  };

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Editor</h3>

        <form onSubmit={handleFormSubmit}>
          <div className="py-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={currentEditor?.name || ""}
              className="input input-bordered w-full mb-4"
            />

            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={currentEditor?.email || ""}
              className="input input-bordered w-full mb-4"
              readOnly
            />

            <label className="block mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              defaultValue={currentEditor?.phone || ""}
              className="input input-bordered w-full mb-4"
            />

            <label className="block mb-2">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={currentEditor?.location || ""}
              className="input input-bordered w-full mb-4"
            />

            <label className="block mb-2">Software</label>
            <input
              type="text"
              name="software"
              defaultValue={
                currentEditor?.software ? currentEditor.software.join(", ") : ""
              }
              className="input input-bordered w-full mb-4"
            />

            <label className="block mb-2">Specializations</label>
            <input
              type="text"
              name="specializations"
              defaultValue={
                currentEditor?.specializations
                  ? currentEditor.specializations.join(", ")
                  : ""
              }
              className="input input-bordered w-full mb-4"
            />

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </form>
    </dialog>
  );
}

export default Modal;
