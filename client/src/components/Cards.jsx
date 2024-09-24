import Card from "./Card";
import axios from "axios";
import React, { useState, useEffect } from "react";

function Cards() {
  const [editorData, setEditorData] = useState([]);
  const [plansData, setPlansData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      try {
        const editorRes = await axios.get("http://localhost:4000/editor_gig");
        setEditorData(editorRes.data || []);
        console.log("Editor Response:", editorRes);

        const plansRes = await axios.get(
          "http://localhost:4000/editor_gig/plans"
        );
        setPlansData(plansRes.data || []); // Make sure this is correct
        console.log("Plans Response:", plansRes);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Editor Data Updated:", editorData);
    console.log(
      "Plans Data Updated:",
      plansData,
      editorData.length,
      plansData.length
    );
    if (editorData.length > 0 && plansData.length > 0) {
      const combined = editorData.map((editor) => {
        const plans = plansData.filter(
          (plan) =>
            plan.email.trim().toLowerCase() ===
            editor.email.trim().toLowerCase()
        );
        return { ...editor, plans };
      });

      console.log("Combined Data:", combined);
      setCombinedData(combined);
    }
  }, [editorData, plansData]);

  return (
    <div>
      {combinedData.map((editor) => (
        <Card key={editor._id} data={editor} />
      ))}
    </div>
  );
}

export default Cards;
