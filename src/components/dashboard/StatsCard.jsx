
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const colorConfig = {
  blue: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-50",
    text: "text-blue-600",
    gradient: "from-blue-500 to-indigo-600",
    iconGradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20"
  },
  green: {
    bg: "bg-green-500",
    bgLight: "bg-green-50",
    text: "text-green-600",
    gradient: "from-green-500 to-emerald-600",
    iconGradient: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/20"
  },
  purple: {
    bg: "bg-purple-500",
    bgLight: "bg-purple-50",
    text: "text-purple-600",
    gradient: "from-purple-500 to-indigo-600",
    iconGradient: "from-purple-500 to-indigo-600",
    shadow: "shadow-purple-500/20"
  },
  orange: {
    bg: "bg-orange-500",
    bgLight: "bg-orange-50",
    text: "text-orange-600",
    gradient: "from-orange-500 to-red-600",
    iconGradient: "from-orange-500 to-red-600",
    shadow: "shadow-orange-500/20"
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4
    }
  }
};

export default function StatsCard({ title, value, icon: Icon, color, trend }) {
  const config = colorConfig[color] || colorConfig.blue;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.2 } }}
    >
      <Card className={`relative overflow-hidden border-0 shadow-lg ${config.shadow} hover:shadow-xl hover:${config.shadow} bg-white h-full transition-all duration-200`}>
        <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-br ${config.gradient} rounded-full opacity-10`} />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {title}
          </CardTitle>
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${config.iconGradient} shadow-md`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900">{value}</div>
          {trend && (
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-slate-600 font-medium">{trend}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
