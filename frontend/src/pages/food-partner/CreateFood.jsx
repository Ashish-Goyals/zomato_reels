import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "../../styles/create-food.css";
import { useNavigate } from "react-router-dom";

const CreateFood = () => {
  
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // File-related state
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [fileError, setFileError] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Update preview when videoFile changes
  useEffect(() => {
    if (!videoFile) {
      setVideoURL("");
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoURL(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  // Generic handler for inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setVideoFile(null);
      setFileError("");
      return;
    }
    if (!file.type.startsWith("video/")) {
      setFileError("Please select a valid video file.");
      return;
    }
    setFileError("");
    setVideoFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setFileError("Please drop a valid video file.");
      return;
    }
    setFileError("");
    setVideoFile(file);
  };

  const onDragOver = (e) => e.preventDefault();
  const openFileDialog = () => fileInputRef.current?.click();

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("video", videoFile);

    const response = await axios.post("/api/food", formData, {
      withCredentials: true,
    });

    console.log(response.data);
    navigate("/");

    // Reset form
    setForm({ name: "", description: "" });
    setVideoFile(null);
  };

  const isDisabled = useMemo(
    () => !form.name.trim() || !videoFile,
    [form.name, videoFile]
  );

  return (
    <div className="create-food-page">
      <div className="create-food-card">
        <header className="create-food-header">
          <h1 className="create-food-title">Create Food</h1>
          <p className="create-food-subtitle">
            Upload a short video, give it a name, and add a description.
          </p>
        </header>

        <form className="create-food-form" onSubmit={onSubmit}>
          {/* Video Upload */}
          <div className="field-group">
            <label htmlFor="foodVideo">Food Video</label>
            <input
              id="foodVideo"
              ref={fileInputRef}
              className="file-input-hidden"
              type="file"
              accept="video/*"
              onChange={onFileChange}
            />

            <div
              className="file-dropzone"
              role="button"
              tabIndex={0}
              onClick={openFileDialog}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFileDialog();
                }
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <div className="file-dropzone-inner">
                <svg
                  className="file-icon"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10.8 3.2a1 1 0 0 1 .4-.08h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v7.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6.4a1 1 0 0 1 1-1h1.6V3.2a1 1 0 0 1 1-1h1.6a1 1 0 0 1 .6.2z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9 12.75v-1.5c0-.62.67-1 1.2-.68l4.24 2.45c.53.3.53 1.05 0 1.35L10.2 16.82c-.53.31-1.2-.06-1.2-.68v-1.5"
                    fill="currentColor"
                  />
                </svg>
                <div className="file-dropzone-text">
                  <strong>Tap to upload</strong> or drag and drop
                </div>
                <div className="file-hint">MP4, WebM, MOV • Up to ~100MB</div>
              </div>
            </div>

            {fileError && (
              <p className="error-text" role="alert">
                {fileError}
              </p>
            )}

            {videoFile && (
              <div className="file-chip" aria-live="polite">
                <span className="file-chip-name">{videoFile.name}</span>
                <span className="file-chip-size">
                  {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <div className="file-chip-actions">
                  <button type="button" className="btn-ghost" onClick={openFileDialog}>
                    Change
                  </button>
                  <button
                    type="button"
                    className="btn-ghost danger"
                    onClick={() => {
                      setVideoFile(null);
                      setFileError("");
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {videoURL && (
            <div className="video-preview">
              <video
                className="video-preview-el"
                src={videoURL}
                controls
                playsInline
                preload="metadata"
              />
            </div>
          )}

          {/* Food Name */}
          <div className="field-group">
            <label htmlFor="foodName">Name</label>
            <input
              id="foodName"
              name="name"
              type="text"
              placeholder="e.g., Spicy Paneer Wrap"
              value={form.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Food Description */}
          <div className="field-group">
            <label htmlFor="foodDesc">Description</label>
            <textarea
              id="foodDesc"
              name="description"
              rows={4}
              placeholder="Write a short description"
              value={form.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button className="btn-primary" type="submit" disabled={isDisabled}>
              Save Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
