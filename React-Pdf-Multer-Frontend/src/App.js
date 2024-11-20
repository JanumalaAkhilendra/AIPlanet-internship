import Navbar from "./components/Navbar";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

function App() {

  return (
    <div className="App">
      <Navbar/>
    </div>
  );

}

export default App;
