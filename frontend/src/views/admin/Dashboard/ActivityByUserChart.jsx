import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export const ActivityByUserChart = ({ data }) => {
    // Transform data for horizontal bar chart
    const chartData = data.map(item => ({
        user: item.user.length > 15 ? item.user.substring(0, 15) + '...' : item.user,
        activities: item.count,
        fullName: item.user
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={chartData}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                    type="category"
                    dataKey="user"
                    tick={{ fontSize: 12 }}
                    width={80}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px'
                    }}
                    formatter={(value, name) => [value, 'Activities']}
                    labelFormatter={(label) => `User: ${chartData.find(d => d.user === label)?.fullName || label}`}
                />
                <Bar
                    dataKey="activities"
                    fill="#22c55e"
                    radius={[0, 4, 4, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};