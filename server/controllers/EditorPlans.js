import Editor_plans from "../model/Editor_gig_plans.js";

export const EditorPlansData = async (req, res) => {
    try {
      const EditorPlanData = await Editor_plans.find();
      if (!EditorPlanData) {
        return res.status(404).json({ message: "No editor data found" });
      }
      console.log("Data retrieved successfully");
      res.status(200).json(EditorPlanData);
    } catch (err) {
      console.log("Error:", err);
      res.status(500).json({ error: err.message });
    }
  };