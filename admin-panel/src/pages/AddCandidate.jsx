import React, { useState } from "react";

function AddCandidate({ onAdd }) {
  const [name, setName] = useState("");
  const [party, setParty] = useState("");

  const [candidatePhoto, setCandidatePhoto] = useState(null);
  const [partyLogo, setPartyLogo] = useState(null);

  const [previewCandidate, setPreviewCandidate] = useState("");
  const [previewLogo, setPreviewLogo] = useState("");

  function handleImageChange(e, setFile, setPreview) {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  function resetForm() {
    setName("");
    setParty("");
    setCandidatePhoto(null);
    setPartyLogo(null);
    setPreviewCandidate("");
    setPreviewLogo("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !party.trim() || !candidatePhoto || !partyLogo) {
      alert("All fields are required!");
      return;
    }

    onAdd({
      fullName: name.trim(),
      party: party.trim(),
      candidatePhoto,
      partyLogo,
    });

    resetForm();
  }

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
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Add
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
