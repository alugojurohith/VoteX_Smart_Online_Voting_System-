import React, { useState } from "react";
import axios from "axios";

function AddCandidate({ adminToken, onSuccess }) {
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [candidatePhoto, setCandidatePhoto] = useState(null);
  const [partyLogo, setPartyLogo] = useState(null);
  const [previewCandidate, setPreviewCandidate] = useState("");
  const [previewLogo, setPreviewLogo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName("");
    setParty("");
    setCandidatePhoto(null);
    setPartyLogo(null);
    setPreviewCandidate("");
    setPreviewLogo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !party.trim() || !candidatePhoto || !partyLogo) {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("fullName", name.trim());
      formData.append("party", party.trim());
      formData.append("candidatePhoto", candidatePhoto);
      formData.append("partyLogo", partyLogo);

      const res = await axios.post(
        "http://localhost:5000/api/candidates/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      alert("Candidate added successfully!");
      resetForm();

      if (onSuccess) onSuccess(res.data.candidate);
    } catch (err) {
      console.error("Error uploading candidate:", err);
      alert(
        err.response?.data?.message ||
          "Something went wrong while adding the candidate."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-black">Add Candidate</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-xl shadow-lg border border-blue-200"
      >
        {/* FULL NAME */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter candidate name"
            required
          />
        </div>

        {/* PARTY */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Party
          </label>
          <input
            type="text"
            value={party}
            onChange={(e) => setParty(e.target.value)}
            className="w-full p-3 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter party name"
            required
          />
        </div>

        {/* CANDIDATE PHOTO */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Candidate Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(e, setCandidatePhoto, setPreviewCandidate)
            }
            className="w-full p-3 border border-blue-300 rounded-lg"
            required
          />
          {previewCandidate && (
            <img
              src={previewCandidate}
              alt="Preview"
              className="w-28 h-28 mt-3 rounded-xl object-cover border border-blue-400 shadow-sm"
            />
          )}
        </div>

        {/* PARTY LOGO */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Party Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(e, setPartyLogo, setPreviewLogo)
            }
            className="w-full p-3 border border-blue-300 rounded-lg"
            required
          />
          {previewLogo && (
            <img
              src={previewLogo}
              alt="Preview"
              className="w-24 h-24 mt-3 rounded-xl object-cover border border-blue-400 shadow-sm bg-white"
            />
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-900 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCandidate;
