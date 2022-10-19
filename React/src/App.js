import React from "react";
import "./App.css";
import ContentEditor from "./ContentEditor.js";




export default function App() {
  return (
    <div className="App">     
      <h2>Spellchecker - French</h2>
      <i>Please select text for replace currect word</i>
      <ContentEditor  content="je m'appelle chakri" lang="fr" />
      <h2>Spellchecker - Italian </h2>
      <i>Please select text for replace currect word</i>
      <ContentEditor  content="il mio nome è chakri" lang="it" />
      <h2>Spellchecker - English-GB</h2>
      <i>Please select text for replace currect word</i>
      <ContentEditor  content="this is woddrng" lang="en-gb" />
    </div>
  );
}
