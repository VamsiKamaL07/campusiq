import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: Props) {
  return (
    <div className="p-6 min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
          <Clock size={36} className="text-primary-500" />
        </div>
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white mb-3">
          {title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {description ?? "This page is part of the full CampusIQ platform and is currently being developed. The core AI Circular Studio, dashboards, and notification workflows are fully functional."}
        </p>
        <button
          onClick={() => window.history.back()}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <ArrowLeft size={14} />
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
