import { useEffect, useState } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComp from "../PdfComp";
import "./Navbar.css"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

function App() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
    const [allImage, setAllImage] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [context, setContext] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);

    useEffect(() => {
        getPdf();
    }, []);

    // Fetch PDFs from the backend
    const getPdf = async () => {
        const result = await axios.get("http://localhost:5000/get-files");
        setAllImage(result.data.data);
    };

    // Upload PDFs to the backend
    const submitImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        const result = await axios.post(
            "http://localhost:5000/upload-files",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        if (result.data.status === "ok") {
            alert("Uploaded Successfully!!!");
            getPdf();
        }
    };

    // Show PDF in PdfComp
    const showPdf = (pdf) => {
        setPdfFile(`http://localhost:5000/files/${pdf}`);
    };

    // Ask question about a selected PDF
    const askQuestion = async (e) => {
        e.preventDefault();

        if (!selectedPdf || !question) {
            alert("Please select a PDF and ask a question");
            return;
        }

        // Send question and context to the backend
        const result = await axios.post("http://localhost:5000/ask-question", {
            pdfId: selectedPdf._id,
            question,
            context,
        });

        if (result.data) {
            const newAnswer = result.data.answer || "No relevant answer found.";
            setAnswer(newAnswer);
            // Update context with the new question and answer
            setContext((prevContext) => [
                ...prevContext,
                { question, answer: newAnswer },
            ]);
            setQuestion(""); // Clear the input field
        }
    };

    return (
        <>
            <div className="Navbar">
                <div className="brand">
                    <div className="brand-icon">AI</div>
                    <span className="brand-name">planet</span>
                </div>
                <div className="main-header">
                    <button className="upload-button" onClick={() => setShowUploadModal(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload PDF
                    </button>
                </div>
            </div>
            <div className="app-container">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-header">
                        {/* <div className="brand">
                            <div className="brand-icon">AI</div>
                            <span className="brand-name">planet</span>
                        </div> */}

                        <div className="pdf-list">
                            {allImage?.map((data) => (
                                <div
                                    key={data._id}
                                    className={`pdf-item ${selectedPdf === data ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedPdf(data);
                                        showPdf(data.pdf);
                                        setContext([]);
                                    }}
                                >
                                    <h5>{data.title}</h5>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {/* <div className="main-header">
                        <h2 className="header-title">
                            {selectedPdf ? selectedPdf.title : 'Select a PDF'}
                        </h2>
                        <button className="upload-button" onClick={() => setShowUploadModal(true)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Upload PDF
                        </button>
                    </div> */}

                    <div className="split-view">
                        {/* PDF Viewer */}
                        <div className="pdf-viewer">
                            <PdfComp pdfFile={pdfFile} />
                        </div>

                        {/* Chat Area */}
                        <div className="chat-area">
                            <div className="messages-container">
                                {context.map((item, index) => (
                                    <div key={index} className="message-group">
                                        <div className="message user-message">
                                            {item.question}
                                        </div>
                                        <div className="message bot-message">
                                            {item.answer}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="chat-input">
                                <form onSubmit={askQuestion} className="input-form">
                                    <input
                                        type="text"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="Ask a question about the PDF..."
                                        className="message-input"
                                    />
                                    <button type="submit" className="send-button">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3 className="modal-title">Upload PDF</h3>
                            <form onSubmit={submitImage}>
                                <div className="modal-form-group">
                                    <input
                                        type="text"
                                        placeholder="Enter filename"
                                        className="modal-input"
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="modal-form-group">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="modal-input"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        required
                                    />
                                </div>
                                <div className="modal-buttons">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadModal(false)}
                                        className="modal-button modal-cancel"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="modal-button modal-submit"
                                    >
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default App;