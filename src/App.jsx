import { useState } from "react";
import BlobShader from "./components/BlobShader/BlobShader";
import BlobButton from "./components/BlobButton/BlobButton";
import "./App.scss";

export default function App() {
  return (
    <>
      <BlobShader />
      <BlobButton label={"Coucou"} onClick={"coucou"} />
    </>
  );
}
