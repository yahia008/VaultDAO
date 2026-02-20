import React from 'react';
import { Link } from 'react-router-dom';
import { getAllTemplates, getMostUsedTemplates } from '../../utils/templates';

const Overview: React.FC = () => {
    const quickActionTemplates = (() => {
        const mostUsed = getMostUsedTemplates(3);
        if (mostUsed.length > 0) {
            return mostUsed;
        }
        return getAllTemplates().slice(0, 3);
    })();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Treasury Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Total Balance</h3>
                    <p className="text-4xl font-bold mt-2">$0.00</p>
                    <div className="mt-4 flex items-center text-sm text-green-400">
                        <span>+0.0% from last week</span>
                    </div>
                </div>

                {/* Active Proposals */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Active Proposals</h3>
                    <p className="text-4xl font-bold mt-2">0</p>
                    <div className="mt-4 text-sm text-gray-400">
                        <span>0 needing your approval</span>
                    </div>
                </div>

                {/* Signers */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Active Signers</h3>
                    <p className="text-4xl font-bold mt-2">0</p>
                    <div className="mt-4 text-sm text-gray-400">
                        <span>Threshold: 0/0</span>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold">Quick Actions</h3>
                    <Link to="/dashboard/templates" className="text-sm text-purple-300 hover:text-purple-200">
                        Manage templates
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {quickActionTemplates.map((template) => (
                        <Link
                            key={template.id}
                            to={`/dashboard/proposals?template=${encodeURIComponent(template.id)}`}
                            className="min-h-[44px] rounded-lg border border-gray-600 bg-gray-900 p-3 text-left transition-colors hover:border-purple-500"
                        >
                            <p className="font-medium text-white">{template.name}</p>
                            <p className="text-sm text-gray-400">{template.category}</p>
                            <p className="text-xs text-gray-500">Used {template.usageCount} times</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Overview;
