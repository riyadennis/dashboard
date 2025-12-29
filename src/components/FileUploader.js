import { useState, useRef } from "react";
import { Card, Button, ProgressBar, Alert } from "react-bootstrap";
import axios from "axios";

function FileUploader() {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("idle");
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const fileInputRef = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            handleFileSelection(droppedFiles[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (selectedFile) => {
        setFile(selectedFile);
        setUploadProgress(0);
        setUploadStatus("selected");
        setErrorMessage("");
    };

    const uploadFile = async () => {
        if (!file) return;

        setUploadStatus("uploading");
        setUploadProgress(0);
        setErrorMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post("http://localhost:8090/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });

            setUploadStatus("completed");
        } catch (error) {
            setUploadStatus("error");
            setErrorMessage(error.response?.data?.message || "Upload failed. Please try again.");
            console.error("Upload error:", error);
        }
    };

    const resetUploader = () => {
        setFile(null);
        setUploadProgress(0);
        setUploadStatus("idle");
        setErrorMessage("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    return (
        <Card style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}>
            <Card.Body>
                <Card.Title style={{ marginBottom: "20px", textAlign: "center" }}>
                    File Uploader
                </Card.Title>

                <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                        border: isDragging ? "2px dashed #007bff" : "2px dashed #ccc",
                        borderRadius: "10px",
                        padding: "40px",
                        textAlign: "center",
                        backgroundColor: isDragging ? "#e7f3ff" : "#f8f9fa",
                        transition: "all 0.3s ease",
                        marginBottom: "20px",
                        cursor: "pointer"
                    }}
                    onClick={handleBrowseClick}
                >
                    <input
                        type="file"
                        name="file"
                        ref={fileInputRef}
                        onChange={handleFileInput}
                        style={{ display: "none" }}
                        disabled={uploadStatus === "uploading"}
                    />
                    <div style={{ fontSize: "48px", marginBottom: "10px" }}>📁</div>
                    <p style={{ marginBottom: "10px", color: "#6c757d" }}>
                        {isDragging ? "Drop file here" : "Drag and drop file here"}
                    </p>
                    <p style={{ color: "#6c757d", fontSize: "14px" }}>or</p>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleBrowseClick}
                        disabled={uploadStatus === "uploading"}
                    >
                        Browse Files
                    </Button>
                </div>

                {file && (
                    <div style={{ marginBottom: "20px" }}>
                        <Alert variant="info">
                            <strong>Selected File:</strong> {file.name}
                            <br />
                            <strong>Size:</strong> {formatFileSize(file.size)}
                        </Alert>
                    </div>
                )}

                {uploadStatus === "uploading" && (
                    <div style={{ marginBottom: "20px" }}>
                        <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
                            Uploading... {uploadProgress}%
                        </p>
                        <ProgressBar
                            now={uploadProgress}
                            label={`${uploadProgress}%`}
                            animated
                            variant="success"
                        />
                    </div>
                )}

                {uploadStatus === "completed" && (
                    <Alert variant="success" style={{ marginBottom: "20px" }}>
                        ✓ Upload completed successfully!
                    </Alert>
                )}

                {uploadStatus === "error" && errorMessage && (
                    <Alert variant="danger" style={{ marginBottom: "20px" }}>
                        ✗ {errorMessage}
                    </Alert>
                )}

                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    {file && uploadStatus !== "uploading" && uploadStatus !== "completed" && (
                        <Button
                            variant="primary"
                            onClick={uploadFile}
                        >
                            Upload File
                        </Button>
                    )}

                    {(uploadStatus === "completed" || uploadStatus === "error") && (
                        <Button
                            variant="secondary"
                            onClick={resetUploader}
                        >
                            Upload Another File
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}

export default FileUploader;
