import { useState, useEffect } from "react";
import axiosInstance from "../../config/apiConfig";

export const AnalyticsPanel = ({ paperId }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get(`/api/documents/${paperId}/analytics`)
            .then(r => setAnalytics(r.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [paperId]);

    if (loading) return (
        <div className="text-sm text-gray-500 py-4">Loading analytics…</div>
    );
    if (!analytics) return null;

    const max = Math.max(analytics.viewCount, analytics.shareCount, analytics.downloadCount, 1);
    const bars = [
        { label: 'Views',     value: analytics.viewCount,     color: 'bg-blue-600' },
        { label: 'Shares',    value: analytics.shareCount,    color: 'bg-blue-400' },
        { label: 'Downloads', value: analytics.downloadCount, color: 'bg-gray-400' },
    ];

    return (
        <div className="mt-6 p-5 rounded-lg border border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Publication Analytics
            </h3>

            {/* Stat row */}
            <div className="flex gap-6 mb-5">
                {bars.map(({ label, value }) => (
                    <div key={label} className="flex flex-col">
                        <span className="text-2xl font-semibold text-gray-800">
                            {value.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">{label}</span>
                    </div>
                ))}
            </div>

            {/* Bar chart */}
            <div className="flex flex-col gap-3">
                {bars.map(({ label, value, color }) => (
                    <div key={label} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                                className={`${color} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${(value / max) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-600 w-8 text-right">
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};